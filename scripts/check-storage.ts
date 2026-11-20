import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getStorageEnvironment } from "../env";
import { s3ClientConfig } from "../cms/storage";

const { loadEnvConfig } = createRequire(import.meta.url)("@next/env") as typeof import("@next/env");
loadEnvConfig(process.cwd());
// A diagnostic may run while the application deliberately remains in local mode.
const storage = getStorageEnvironment({ ...process.env, STORAGE_DRIVER: "s3" });
if (storage.driver !== "s3") throw new Error("Configure S3 storage before checking its connection.");
const client = new S3Client({ ...s3ClientConfig(storage), maxAttempts: 1 });
const key = `_connection-check/${randomUUID()}.txt`;
const body = Buffer.from("Pazelgreen private storage connection check.");
let attempted = false;
let failed = false;
let phase = "authenticated write";
try {
  attempted = true;
  await client.send(new PutObjectCommand({ Bucket: storage.bucket, Key: key, Body: body, ContentType: "text/plain" }));
  phase = "authenticated read";
  const result = await client.send(new GetObjectCommand({ Bucket: storage.bucket, Key: key }));
  if (!result.Body || !Buffer.from(await result.Body.transformToByteArray()).equals(body)) throw new Error("Storage returned different bytes.");
  const urls = [`${storage.endpoint}/${storage.bucket}/${key}`];
  // The S3 API always requires authentication even when a Supabase bucket is public.
  // Check the public REST serving route too; it must deny this known object.
  if (new URL(storage.endpoint).pathname.endsWith("/storage/v1/s3")) urls.push(`${storage.endpoint.replace(/\/s3$/, "/object/public")}/${storage.bucket}/${key}`);
  for (const url of urls) {
    phase = url.includes("/object/public/") ? "Supabase public-route privacy" : "anonymous S3 privacy";
    const response = await fetch(url, { signal: AbortSignal.timeout(10000), redirect: "error" });
    await response.body?.cancel();
    if (![400, 401, 403, 404].includes(response.status)) { console.error(`Privacy check received HTTP ${response.status}; keep the bucket private.`); throw new Error("Anonymous access check failed."); }
  }
  console.info("Storage check passed: authenticated write/read matched; anonymous access denied.");
} catch (error) {
  failed = true;
  // Provider errors can contain signed request details. Report a safe category only.
  const name = error instanceof Error && /^[a-zA-Z0-9]+$/.test(error.name) ? error.name : "Error";
  console.error(`Storage check failed during ${phase} (${name}). Check endpoint, region, credentials and bucket privacy; no credential values logged.`);
} finally {
  if (attempted) {
    try { await client.send(new DeleteObjectCommand({ Bucket: storage.bucket, Key: key })); console.info("Temporary connection-check object removed."); }
    catch { failed = true; console.error(`Temporary check object could not be removed. Remove only this check object from the configured bucket: ${key}`); }
  }
  client.destroy();
}
process.exitCode = failed ? 1 : 0;
