import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";
import { once } from "node:events";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());
const testURL = process.env.TEST_DATABASE_URL;
if (!testURL || !new URL(testURL).pathname.endsWith("_test") || !["localhost", "127.0.0.1"].includes(new URL(testURL).hostname)) {
  throw new Error("HTTP checks require the disposable local TEST_DATABASE_URL and fixtures from pnpm test:integration.");
}
const base = "http://127.0.0.1:3101";
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3101"], {
  env: { ...process.env, APP_ENV: "test", SERVER_URL: base, PUBLIC_UPLOAD_DIR: path.resolve("storage/test-public"), PRIVATE_UPLOAD_DIR: path.resolve("storage/test-private") },
  windowsHide: true, stdio: ["ignore", "pipe", "pipe"],
});
let output = "";
server.stdout.on("data", (chunk: Buffer) => { output = (output + chunk.toString()).slice(-8000); });
server.stderr.on("data", (chunk: Buffer) => { output = (output + chunk.toString()).slice(-8000); });
async function api(route: string, token?: string, data?: object) {
  return fetch(new URL(route, base), { method: data ? "POST" : "GET", headers: {
    Origin: base, ...(token ? { Authorization: `JWT ${token}` } : {}), ...(data ? { "Content-Type": "application/json" } : {}),
  }, body: data ? JSON.stringify(data) : undefined, redirect: "follow" });
}
async function patch(route: string, token: string, data: object) {
  return fetch(new URL(route, base), { method: "PATCH", headers: { Origin: base, Authorization: `JWT ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(data) });
}
try {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null) throw new Error(`Local test server exited: ${output}`);
    const ready = await fetch(`${base}/api/media`).then(() => true).catch(() => false);
    if (ready) break;
    if (attempt === 99) throw new Error(`Local test server did not start: ${output}`);
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  for (const route of ["/", "/about", "/solutions", "/join-us", "/contact", "/admin/login", "/admin/accept-invitation", "/admin/create-first-user"]) {
    assert.equal((await api(route)).status, 200, route);
  }
  for (const route of ["/api/users", "/api/private-files", "/api/preview/media/1"]) assert.equal((await api(route)).status, 403, route);
  assert.equal((await api("/api/users/first-register", undefined, { email: "http-blocked@pazelgreen.test", name: "Blocked", password: "test-only-password-123", role: "admin" })).status, 403);
  assert.equal((await api("/api/invitations/accept", undefined, {})).status, 400);

  const password = "integration-only-passphrase-123";
  const adminLogin = await api("/api/users/login", undefined, { email: "admin@pazelgreen.test", password });
  assert.equal(adminLogin.status, 200);
  const adminToken = (await adminLogin.json()).token as string;
  const staffLogin = await api("/api/users/login", undefined, { email: "staff@pazelgreen.test", password });
  assert.equal(staffLogin.status, 200);
  const { token: staffToken, user: staff } = await staffLogin.json();
  assert.equal((await api("/api/invitations", staffToken, { email: "blocked@pazelgreen.test", name: "Blocked", role: "admin" })).status, 403);
  await patch(`/api/users/${staff.id}`, staffToken, { role: "admin" });
  assert.equal((await (await api(`/api/users/${staff.id}`, adminToken)).json()).role, "staff");

  const media = (await (await api("/api/media?draft=true&limit=1", staffToken)).json()).docs[0];
  assert.ok(media, "Integration media fixture is required.");
  assert.equal((await patch(`/api/media/${media.id}`, staffToken, { _status: "published" })).status, 403);
  assert.equal((await patch(`/api/media/${media.id}`, staffToken, { alt: "HTTP approved image" })).status, 200);
  assert.equal((await patch(`/api/media/${media.id}`, staffToken, { reviewState: "in-review" })).status, 200);
  assert.equal((await patch(`/api/media/${media.id}`, adminToken, { _status: "published" })).status, 200);
  assert.equal((await (await api(`/api/media/${media.id}`)).json()).alt, "HTTP approved image");
  assert.equal((await patch(`/api/media/${media.id}`, staffToken, { alt: "HTTP unapproved replacement" })).status, 200);
  const live = await (await api(`/api/media/${media.id}`)).json();
  assert.equal(live.alt, "HTTP approved image");
  assert.equal(live.reviewNote, undefined);
  const preview = await api(`/api/preview/media/${media.id}`, staffToken);
  assert.equal(preview.headers.get("cache-control"), "private, no-store");
  assert.equal((await preview.json()).alt, "HTTP unapproved replacement");

  const file = (await (await api("/api/private-files?limit=1", staffToken)).json()).docs[0];
  assert.ok(file, "Integration private-file fixture is required.");
  const downloadPath = `/api/private-files/file/${encodeURIComponent(file.filename)}`;
  assert.equal((await api(downloadPath)).status, 403);
  const download = await api(downloadPath, staffToken);
  assert.equal(download.status, 200);
  assert.equal(download.headers.get("cache-control"), "private, no-store");
  assert.ok((await download.text()).startsWith("%PDF-"));

  assert.equal((await patch(`/api/users/${staff.id}`, adminToken, { active: false })).status, 200);
  assert.equal((await api(downloadPath, staffToken)).status, 403, "Deactivation must invalidate an existing session.");
  assert.equal((await patch(`/api/users/${staff.id}`, adminToken, { active: true })).status, 200);
  console.info("HTTP smoke checks passed: public/admin routes, registration denial, role enforcement, publication, preview, private downloads and session revocation.");
} finally {
  server.kill();
  if (server.exitCode === null) await once(server, "exit");
}
