import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { once } from "node:events";
import type { Server } from "node:http";
import path from "node:path";
import { testStorageEnvironment } from "../fixtures/storage-environment";

// Run the same owned mock as the Postman simulation; CI needs no Postman account.
const { createS3Server } = createRequire(import.meta.url)("../../postman/mocks/s3/default.cjs") as { createS3Server: () => Server };
const server = createS3Server();
server.listen(0, "127.0.0.1");
await once(server, "listening");
const address = server.address();
assert.ok(address && typeof address !== "string");
const endpoint = `http://127.0.0.1:${address.port}`;
const env = { ...process.env, CMS_TEST_STORAGE: "s3", CMS_TEST_S3_ENDPOINT: endpoint };
async function run(args: string[], childEnv = env) {
  const child = spawn(process.execPath, args, { env: childEnv, stdio: "inherit", windowsHide: true });
  const [code] = await once(child, "exit");
  if (code !== 0) throw new Error("S3 storage acceptance failed; see the preceding test assertions.");
}
try {
  if (process.argv.includes("--copy-local")) {
    const copyEnv = { ...env, ...testStorageEnvironment(env), APP_ENV: "test", PUBLIC_UPLOAD_DIR: path.resolve("storage/test-public"), PRIVATE_UPLOAD_DIR: path.resolve("storage/test-private") };
    await run(["--import", "tsx", "scripts/copy-local-uploads.ts"], copyEnv);
    // Verify retry safety against the already-populated destination.
    await run(["--import", "tsx", "scripts/copy-local-uploads.ts"], copyEnv);
  }
  await run(["node_modules/vitest/vitest.mjs", "run", "--project", "integration"]);
  await run(["--import", "tsx", "tests/http/cms-smoke.ts"]);
  if (process.argv.includes("--browser")) await run(["node_modules/@playwright/test/cli.js", "test", "permissions.spec.ts"]);
  const state = await (await fetch(`${endpoint}/__control/state`)).json() as { keys: string[]; calls: { method: string; path: string }[] };
  for (const method of ["PUT", "HEAD", "GET", "DELETE"]) assert.ok(state.calls.some(call => call.method === method), `S3 ${method} path was not exercised`);
  assert.ok(state.keys.some(key => key.includes("/media/")));
  assert.ok(state.keys.some(key => key.includes("/cvs/")));
  console.info("S3 acceptance passed: real Payload upload/download requests, separate prefixes, private bytes and failure cleanup checked against the local S3 simulator.");
} finally { server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve())); }
