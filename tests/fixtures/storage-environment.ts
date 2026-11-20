/** Opt-in S3 tests can only reach a loopback simulator, never .env credentials. */
export function testStorageEnvironment(source: Record<string, string | undefined> = process.env): Record<string, string> {
  if (source.CMS_TEST_STORAGE !== "s3") return { STORAGE_DRIVER: "local" };
  const endpoint = source.CMS_TEST_S3_ENDPOINT;
  if (!endpoint || !["127.0.0.1", "localhost", "[::1]"].includes(new URL(endpoint).hostname)) throw new Error("S3 tests require a loopback CMS_TEST_S3_ENDPOINT.");
  return { STORAGE_DRIVER: "s3", S3_ENDPOINT: endpoint, S3_REGION: "local", S3_BUCKET: "pazelgreen-test",
    S3_ACCESS_KEY_ID: "local-test-key", S3_SECRET_ACCESS_KEY: "local-test-secret" };
}
