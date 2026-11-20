import path from "node:path";
import { unlink } from "node:fs/promises";
import { DeleteObjectCommand, S3Client, type S3ClientConfig } from "@aws-sdk/client-s3";
import { s3Storage } from "@payloadcms/storage-s3";
import type { CollectionBeforeValidateHook, Plugin, PayloadRequest } from "payload";
import { getStorageEnvironment } from "../env";

export type StorageEnvironment = ReturnType<typeof getStorageEnvironment>;
export const storagePrefixes = { media: "media", "private-files": "cvs" } as const;
export type UploadCollection = keyof typeof storagePrefixes;
export type UploadLocation = { filename: string; prefix?: string | null; _objectKey?: string | null };

export function s3ClientConfig(storage: Extract<StorageEnvironment, { driver: "s3" }>): S3ClientConfig {
  return { endpoint: storage.endpoint, region: storage.region, forcePathStyle: true,
    credentials: { accessKeyId: storage.accessKeyId, secretAccessKey: storage.secretAccessKey },
    // Supabase/R2 do not require AWS's optional checksum extensions.
    requestChecksumCalculation: "WHEN_REQUIRED", responseChecksumValidation: "WHEN_REQUIRED",
    maxAttempts: 3, requestHandler: { connectionTimeout: 5000, requestTimeout: 15000 } };
}

export function storageObjectKey(collection: UploadCollection, doc: UploadLocation) {
  if (!doc.filename || path.posix.basename(doc.filename) !== doc.filename || doc.filename.includes("\\")) throw new Error("Invalid storage filename.");
  const prefix = doc.prefix || storagePrefixes[collection];
  if (prefix !== storagePrefixes[collection] || doc._objectKey && !/^[a-zA-Z0-9_-]+$/.test(doc._objectKey)) throw new Error("Invalid storage location.");
  return path.posix.join(prefix, doc._objectKey || "", doc.filename);
}

/** Retain Payload's access-controlled URLs; never issue public/signed CV links. */
export function objectStoragePlugin(storage: StorageEnvironment): Plugin {
  return async config => {
    const enabled = storage.driver === "s3";
    const configured = await s3Storage({
      enabled, alwaysInsertFields: true, bucket: enabled ? storage.bucket : "unused-local-storage",
      clientCacheKey: enabled ? `${storage.endpoint}/${storage.bucket}` : "local-storage",
      config: enabled ? s3ClientConfig(storage) : {},
      clientUploads: false, signedDownloads: false,
      collections: { media: { prefix: storagePrefixes.media },
        "private-files": { prefix: storagePrefixes["private-files"] } },
    })(config);
    // Storage metadata must not let a caller redirect an authorized record to
    // another object's location. Apply in both modes so schema stays identical.
    return { ...configured, collections: configured.collections?.map(collection => {
      if (!(collection.slug in storagePrefixes)) return collection;
      const prefix = storagePrefixes[collection.slug as UploadCollection];
      const protectLocation: CollectionBeforeValidateHook = ({ data, originalDoc }) => {
        if (data) { data.prefix = prefix; data._objectKey = originalDoc?._objectKey ?? null; }
        return data;
      };
      return { ...collection, hooks: { ...collection.hooks,
        beforeValidate: [protectLocation, ...(collection.hooks?.beforeValidate ?? [])] } };
    }) };
  };
}

/** External writes are not rolled back with the application database transaction. */
export async function cleanupApplicationUpload(req: PayloadRequest) {
  const doc = req.context.applicationUpload as UploadLocation | undefined;
  if (!doc) return;
  const storage = getStorageEnvironment();
  try {
    if (storage.driver === "s3") {
      const client = new S3Client(s3ClientConfig(storage));
      try { await client.send(new DeleteObjectCommand({ Bucket: storage.bucket, Key: storageObjectKey("private-files", doc) })); }
      finally { client.destroy(); }
    } else {
      const upload = req.payload.collections["private-files"].config.upload;
      if (upload && typeof upload === "object" && path.basename(doc.filename) === doc.filename) await unlink(path.resolve(upload.staticDir!, doc.filename));
    }
  } catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) req.payload.logger.error("Failed to clean up an uncommitted CV upload; reconcile private storage before retention review.");
  }
}
