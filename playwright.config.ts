import path from "node:path";
import nextEnv from "@next/env";
import { defineConfig } from "@playwright/test";

nextEnv.loadEnvConfig(process.cwd());
const testURL = process.env.TEST_DATABASE_URL;
if (!testURL || !new URL(testURL).pathname.endsWith("_test") || !["127.0.0.1", "localhost"].includes(new URL(testURL).hostname)) {
  throw new Error("Browser tests require the verified local disposable TEST_DATABASE_URL and integration fixtures.");
}

export default defineConfig({
  testDir: "./tests/browser", fullyParallel: false, workers: 1, retries: process.env.CI ? 1 : 0,
  reporter: "list", use: { baseURL: "http://127.0.0.1:3102", channel: process.env.PLAYWRIGHT_CHANNEL,
    trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [
    { name: "desktop", use: { viewport: { width: 1280, height: 900 } } },
    { name: "mobile", use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: {
    command: "pnpm exec next start --hostname 127.0.0.1 --port 3102",
    url: "http://127.0.0.1:3102/blog", reuseExistingServer: false, timeout: 60000,
    env: { APP_ENV: "test", SERVER_URL: "http://127.0.0.1:3102", PUBLIC_UPLOAD_DIR: path.resolve("storage/test-public"), PRIVATE_UPLOAD_DIR: path.resolve("storage/test-private") },
  },
});
