import path from "node:path";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getPayload } from "payload";
import { getServerEnvironment } from "../env";
import { s3ClientConfig, storageObjectKey, type UploadCollection } from "../cms/storage";

const { loadEnvConfig } = createRequire(import.meta.url)("@next/env") as typeof import("@next/env");
loadEnvConfig(process.cwd());
const env = getServerEnvironment();
if (env.storage.driver !== "s3") throw new Error("Configure S3 storage before copying local uploads.");
const client = new S3Client(s3ClientConfig(env.storage));
const { default: config } = await import("../payload.config");
const payload = await getPayload({ config });
let verified = 0;
try {
  for (const collection of ["media", "private-files"] satisfies UploadCollection[]) {
    let page = 1, more = true;
    while (more) {
      const result = await payload.find({ collection, draft: true, depth: 0, limit: 100, page, overrideAccess: true });
      for (const doc of result.docs) {
        if (!doc.filename) throw new Error("An upload record is missing its filename; reconcile before continuing.");
        const key = storageObjectKey(collection, { ...doc, filename: doc.filename });
        const directory = collection === "media" ? env.publicStorage : env.privateStorage;
        const body = await readFile(path.join(directory, doc.filename));
        // Check first as well as using a conditional write: S3-compatible
        // providers vary in support for conditional PutObject. Writes stay paused.
        let exists = false;
        try {
          const existing = await client.send(new GetObjectCommand({ Bucket: env.storage.bucket, Key: key }));
          if (!existing.Body || !Buffer.from(await existing.Body.transformToByteArray()).equals(body)) throw new Error("Destination conflict.");
          exists = true;
        } catch (error) { if (!(error instanceof Error && "$metadata" in error && (error.$metadata as { httpStatusCode?: number }).httpStatusCode === 404)) throw error; }
        if (!exists) {
          try { await client.send(new PutObjectCommand({ Bucket: env.storage.bucket, Key: key, Body: body, ContentType: doc.mimeType || "application/octet-stream", IfNoneMatch: "*" })); }
          catch (error) { if (!(error instanceof Error && "$metadata" in error && (error.$metadata as { httpStatusCode?: number }).httpStatusCode === 412)) throw error; }
        }
        const stored = await client.send(new GetObjectCommand({ Bucket: env.storage.bucket, Key: key }));
        if (!stored.Body || !Buffer.from(await stored.Body.transformToByteArray()).equals(body)) throw new Error("An existing object differs from its local source; reconcile before continuing.");
        verified++;
      }
      more = result.hasNextPage; page++;
    }
  }
  console.info(`Local upload copy complete: ${verified} objects verified. Local files and database records were preserved.`);
} catch {
  console.error("Local upload copy stopped. Check missing local files, storage permissions or destination conflicts. Existing objects/files were preserved; no private record details logged.");
  process.exitCode = 1;
} finally { client.destroy(); await payload.destroy(); }
// Payload's CLI environment can retain framework handles after destroy.
process.exit(process.exitCode ?? 0);
