import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";
import pg from "pg";
import { createLocalReq, getPayload, type Payload } from "payload";
import { migrations } from "../../migrations";
import { transactionDatabase } from "../../cms/transactions";

nextEnv.loadEnvConfig(process.cwd());

async function runLatestMigration(payload: Payload, direction: "up" | "down") {
  const transaction = await payload.db.beginTransaction();
  if (!transaction) throw new Error("Migration verification requires a transaction.");
  const req = await createLocalReq({}, payload);
  req.transactionID = transaction;
  try {
    // Call the same migration functions without the CLI's process.exit on errors,
    // so failures still reach the scratch-database cleanup in finally.
    await migrations[migrations.length - 1][direction]({ db: transactionDatabase(payload, transaction), payload, req });
    await payload.db.commitTransaction(transaction);
  } catch (error) {
    await payload.db.rollbackTransaction(transaction);
    throw error;
  }
}

async function verifyScratchDatabase() {
  const target = new URL(process.env.TEST_DATABASE_URL ?? "");
  if (!["localhost", "127.0.0.1"].includes(target.hostname) || !/^\/pazelgreen_migration_[a-f0-9]{8}_test$/.test(target.pathname)) {
    throw new Error("The migration worker requires its own local scratch database.");
  }
  process.env.APP_ENV = "test";
  process.env.PUBLIC_UPLOAD_DIR = path.resolve("storage/test-public");
  process.env.PRIVATE_UPLOAD_DIR = path.resolve("storage/test-private");
  const { default: config } = await import("../../payload.config");
  const payload = await getPayload({ config });
  try {
    await payload.db.migrate();
    assert.equal((await payload.db.pool.query("SELECT to_regclass('public.posts') AS relation")).rows[0].relation, "posts");
    await runLatestMigration(payload, "down");
    assert.equal((await payload.db.pool.query("SELECT to_regclass('public.posts') AS relation")).rows[0].relation, null);
    await runLatestMigration(payload, "up");
    assert.equal((await payload.db.pool.query("SELECT to_regclass('public.posts') AS relation")).rows[0].relation, "posts");
    console.info("Migration round trip passed: fresh schema, latest migration down, latest migration reapplied.");
  } finally { await payload.destroy(); }
}

async function main() {
  const configured = process.env.TEST_DATABASE_URL;
  if (!configured) throw new Error("Set the disposable local TEST_DATABASE_URL before checking migrations.");
  const base = new URL(configured);
  if (!["localhost", "127.0.0.1"].includes(base.hostname) || !base.pathname.endsWith("_test")) {
    throw new Error("Migration checks require a verified local test database connection.");
  }
  // Create a distinct database owned by this run; never reset an existing one.
  const name = `pazelgreen_migration_${randomUUID().replaceAll("-", "").slice(0, 8)}_test`;
  if (!/^pazelgreen_migration_[a-f0-9]{8}_test$/.test(name)) throw new Error("Invalid temporary database name.");
  const admin = new pg.Client({ connectionString: configured });
  let created = false;
  await admin.connect();
  try {
    await admin.query(`CREATE DATABASE "${name}"`);
    created = true;
    base.pathname = `/${name}`;
    // Payload's adapter destroy clears metadata but keeps its pg pool open.
    // A worker process lets us close all its sockets before dropping the database.
    const child = spawn(process.execPath, ["--import", "tsx", fileURLToPath(import.meta.url), "--verify"], {
      env: { ...process.env, TEST_DATABASE_URL: base.toString() }, stdio: "inherit", windowsHide: true,
    });
    const code = await new Promise<number>((resolve, reject) => {
      child.once("error", reject);
      child.once("close", code => resolve(code ?? 1));
    });
    if (code !== 0) throw new Error("Migration worker failed; its scratch database will be removed.");
  } finally {
    // Only this run's newly created, validated scratch name can reach FORCE.
    try { if (created) await admin.query(`DROP DATABASE "${name}" WITH (FORCE)`); }
    finally { await admin.end(); }
  }
}

try { if (process.argv[2] === "--verify") await verifyScratchDatabase(); else await main(); }
catch (error) { console.error(error instanceof Error ? error.message : "Migration check failed."); process.exitCode = 1; }
await new Promise<void>(resolve => { process.stdout.write("", () => resolve()); });
process.exit(process.exitCode ?? 0);
