import { describe, expect, it } from "vitest";
import { localDatabaseVariables } from "../../scripts/database-config";

describe("local Docker configuration", () => {
  it("derives all settings from the URL and decodes credentials", () => {
    expect(localDatabaseVariables("postgresql://dev:p%40ss%3Aword@127.0.0.1:5433/pazelgreen")).toEqual({
      POSTGRES_DB: "pazelgreen", POSTGRES_USER: "dev", POSTGRES_PASSWORD: "p@ss:word", POSTGRES_PORT: "5433",
    });
    expect(localDatabaseVariables("postgres://dev:pass@localhost/local").POSTGRES_PORT).toBe("5432");
  });
  it.each([undefined, "bad", "https://dev:pass@localhost/db", "postgres://dev:pass@remote.example/db", "postgres://dev@localhost/db", "postgres://dev:pass@localhost/", "postgres://dev:%ZZ@localhost/db"])("rejects incomplete or nonlocal configuration without exposing credentials", (value) => {
    expect(() => localDatabaseVariables(value)).toThrow(/DEV_DATABASE_URL/);
    try { localDatabaseVariables(value); } catch (error) { expect(String(error)).not.toContain("%ZZ"); }
  });
});
