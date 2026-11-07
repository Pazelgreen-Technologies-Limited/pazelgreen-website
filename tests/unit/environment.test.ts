import path from "node:path";
import { describe, expect, it } from "vitest";
import { getEnvironment, getServerEnvironment } from "../../env";

const base = { PAYLOAD_SECRET: "a".repeat(48), DEV_DATABASE_URL: "postgresql://dev:pass@127.0.0.1:5433/pazelgreen" };
const production = { ...base, APP_ENV: "production", PRODUCTION_DATABASE_URL: "postgresql://prod:pass@db.example.com/pazelgreen", SERVER_URL: "https://pazelgreen.com",
  PUBLIC_UPLOAD_DIR: path.resolve("storage/prod-public"), PRIVATE_UPLOAD_DIR: path.resolve("storage/prod-private"), SMTP_HOST: "smtp.example.com", SMTP_USER: "user", SMTP_PASSWORD: "secret", EMAIL_FROM_ADDRESS: "cms@example.com" };

describe("deployment environment selection", () => {
  it("defaults production runtime to production", () => { expect(getEnvironment({ NODE_ENV: "production" })).toBe("production"); });
  it("allows a local production build to explicitly select development", () => {
    expect(getServerEnvironment({ ...base, APP_ENV: "development", NODE_ENV: "production" }).databaseURL).toBe(base.DEV_DATABASE_URL);
  });
  it("selects only the production database", () => { expect(getServerEnvironment(production).databaseURL).toBe(production.PRODUCTION_DATABASE_URL); });
  it("never falls back to development when production URL is missing", () => {
    expect(() => getServerEnvironment({ ...production, PRODUCTION_DATABASE_URL: "" })).toThrow("PRODUCTION_DATABASE_URL");
  });
  it.each(["localhost", "127.0.0.1", "postgres"])("rejects a local production database: %s", (host) => {
    expect(() => getServerEnvironment({ ...production, PRODUCTION_DATABASE_URL: `postgresql://user:pass@${host}/db` })).toThrow("production database");
  });
  it("requires a distinct test database", () => {
    expect(() => getServerEnvironment({ ...base, APP_ENV: "test" })).toThrow("TEST_DATABASE_URL");
  });
  it("rejects unsupported environments, protocols and weak secrets", () => {
    expect(() => getEnvironment({ APP_ENV: "staging" })).toThrow();
    expect(() => getServerEnvironment({ ...base, DEV_DATABASE_URL: "https://db.example.com" })).toThrow("PostgreSQL");
    expect(() => getServerEnvironment({ ...base, PAYLOAD_SECRET: "short" })).toThrow("PAYLOAD_SECRET");
  });
  it("requires HTTPS, SMTP and persistent storage in production", () => {
    expect(() => getServerEnvironment({ ...production, SERVER_URL: "http://pazelgreen.com" })).toThrow("HTTPS");
    expect(() => getServerEnvironment({ ...production, SMTP_HOST: "" })).toThrow("SMTP_HOST");
    expect(() => getServerEnvironment({ ...production, PRIVATE_UPLOAD_DIR: "" })).toThrow("persistent");
  });
  it("rejects overlapping public/private directories", () => {
    expect(() => getServerEnvironment({ ...base, PUBLIC_UPLOAD_DIR: path.resolve("storage"), PRIVATE_UPLOAD_DIR: path.resolve("storage/private") })).toThrow("separate");
  });
  it("never allows private bytes in Next's static public directory", () => {
    expect(() => getServerEnvironment({ ...base, PRIVATE_UPLOAD_DIR: path.resolve("public/private") })).toThrow("outside");
  });
  it("reports malformed connection strings without repeating credentials", () => {
    expect(() => getServerEnvironment({ ...base, DEV_DATABASE_URL: "private-password:invalid-url" })).toThrow("PostgreSQL");
    expect(() => getServerEnvironment({ ...base, DEV_DATABASE_URL: "postgresql://user:private-password@bad host/db" })).toThrow("not a valid database URL");
  });
  it("validates the SMTP port", () => {
    expect(() => getServerEnvironment({ ...base, SMTP_PORT: "NaN" })).toThrow("SMTP_PORT");
  });
});
