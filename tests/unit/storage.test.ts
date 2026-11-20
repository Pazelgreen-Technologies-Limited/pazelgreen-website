import { describe, expect, it } from "vitest";
import { getStorageEnvironment, getServerEnvironment } from "../../env";
import { objectStoragePlugin, storageObjectKey } from "../../cms/storage";
import { testStorageEnvironment } from "../fixtures/storage-environment";
import { postgresAdapter } from "@payloadcms/db-postgres";

const s3 = { S3_ENDPOINT: "https://example.supabase.co/storage/v1/s3", S3_REGION: "eu-west-1", S3_BUCKET: "uploads",
  S3_ACCESS_KEY_ID: "test-only-key", S3_SECRET_ACCESS_KEY: "test-only-secret" };

describe("private S3-compatible storage", () => {
  it("selects local without credentials, S3 with complete credentials, and explicit local when requested", () => {
    expect(getStorageEnvironment({}).driver).toBe("local");
    expect(getStorageEnvironment(s3).driver).toBe("s3");
    expect(getStorageEnvironment({ ...s3, STORAGE_DRIVER: "local" }).driver).toBe("local");
    expect(() => getStorageEnvironment({ STORAGE_DRIVER: "other" })).toThrow("STORAGE_DRIVER");
  });
  it.each(Object.keys(s3))("fails closed for incomplete S3 settings: %s", key => {
    expect(() => getStorageEnvironment({ ...s3, [key]: "" })).toThrow(key);
  });
  it("supports Supabase bucket names while rejecting paths", () => {
    expect(getStorageEnvironment({ ...s3, S3_BUCKET: "Pazelgreen_uploads" }).driver).toBe("s3");
    expect(() => getStorageEnvironment({ ...s3, S3_BUCKET: "../uploads" })).toThrow("S3_BUCKET");
  });
  it("never connects automated tests to remote .env storage", () => {
    expect(getStorageEnvironment({ ...s3, APP_ENV: "test" }).driver).toBe("local");
    expect(() => getStorageEnvironment({ ...s3, APP_ENV: "test", STORAGE_DRIVER: "s3" })).toThrow("never use remote");
    expect(testStorageEnvironment({ ...s3, CMS_TEST_STORAGE: "" })).toEqual({ STORAGE_DRIVER: "local" });
    expect(() => testStorageEnvironment({ CMS_TEST_STORAGE: "s3", CMS_TEST_S3_ENDPOINT: s3.S3_ENDPOINT })).toThrow("loopback");
  });
  it.each(["http://remote.example.com", "https://user:secret@example.com", "https://example.com?secret=value", "not-a-url"])("rejects unsafe endpoints without printing supplied secrets", endpoint => {
    expect(() => getStorageEnvironment({ ...s3, S3_ENDPOINT: endpoint })).toThrow(/S3|HTTPS/);
  });
  it("allows Netlify production S3 mode without persistent local directories", () => {
    const env = getServerEnvironment({ ...s3, APP_ENV: "production", PRODUCTION_DATABASE_URL: "postgresql://user:pass@db.example.com/db",
      PAYLOAD_SECRET: "x".repeat(48), SERVER_URL: "https://example.com", SMTP_HOST: "smtp.example.com", SMTP_USER: "user", SMTP_PASSWORD: "secret", EMAIL_FROM_ADDRESS: "cms@example.com" });
    expect(env.storage.driver).toBe("s3");
  });
  it("isolates namespaces and rejects traversal/cross-collection locations", () => {
    expect(storageObjectKey("media", { filename: "photo.png" })).toBe("media/photo.png");
    expect(storageObjectKey("private-files", { filename: "cv.pdf" })).toBe("cvs/cv.pdf");
    expect(() => storageObjectKey("media", { filename: "cv.pdf", prefix: "cvs" })).toThrow();
    expect(() => storageObjectKey("media", { filename: "../cv.pdf" })).toThrow();
    expect(() => storageObjectKey("media", { filename: "cv.pdf", _objectKey: "../cvs" })).toThrow();
  });
  it("uses identical metadata schemas in both modes and retains access-controlled URLs", async () => {
    const config = { secret: "test-only", db: postgresAdapter({ pool: {} }), collections: [{ slug: "media", upload: {}, fields: [] }, { slug: "private-files", upload: {}, fields: [] }] };
    const local = await objectStoragePlugin(getStorageEnvironment({}))(config);
    const remote = await objectStoragePlugin(getStorageEnvironment(s3))(config);
    expect(remote.collections?.map(c => c.fields.map(f => "name" in f && f.name))).toEqual(local.collections?.map(c => c.fields.map(f => "name" in f && f.name)));
    const media = remote.collections![0];
    expect(media.upload).toMatchObject({ disableLocalStorage: true });
    expect(typeof media.upload === "object" && media.upload.handlers?.length).toBe(1);
    const data = { prefix: "cvs", _objectKey: "stolen-object" };
    await media.hooks!.beforeValidate![0]({ data, originalDoc: { prefix: "media", _objectKey: null } } as never);
    expect(data).toEqual({ prefix: "media", _objectKey: null });
  });
});
