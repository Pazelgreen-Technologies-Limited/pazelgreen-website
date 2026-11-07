import nextEnv from "@next/env";
import { getPayload } from "payload";
import { transactionDatabase } from "../cms/transactions";

nextEnv.loadEnvConfig(process.cwd());
const email = process.env.BOOTSTRAP_ADMIN_EMAIL;
const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
if (!email || !password || password.length < 12) throw new Error("Set BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD (at least 12 characters) in your local/deployment secrets.");
const { default: config } = await import("../payload.config");
const payload = await getPayload({ config });
try {
  // Serializes simultaneous CLI bootstrap attempts across processes.
  const transaction = await payload.db.beginTransaction();
  if (!transaction) throw new Error("Bootstrap requires a database transaction.");
  try {
    const { sql } = await import("@payloadcms/db-postgres");
    await transactionDatabase(payload, transaction).execute(sql`SELECT pg_advisory_xact_lock(812731)`);
    const req = await (await import("payload")).createLocalReq({ context: { bootstrapAdmin: true } }, payload);
    req.transactionID = transaction;
    const users = await payload.count({ collection: "users", overrideAccess: true, req });
    if (users.totalDocs !== 0) throw new Error("Bootstrap refused: users already exist. Ask an administrator for an invitation.");
    await payload.create({ collection: "users", data: { name: "Administrator", email, password, role: "admin", active: true }, overrideAccess: true, req });
    await payload.db.commitTransaction(transaction);
    console.info("First administrator created. Remove bootstrap credentials from your environment.");
  } catch (error) { await payload.db.rollbackTransaction(transaction); throw error; }
} finally { await payload.destroy(); }

// All database work and adapter cleanup have finished. Do not leave this CLI
// waiting for timers/workers owned by the TS loader or other imported libraries.
await new Promise<void>((resolve) => { process.stdout.write("", () => resolve()); });
process.exit(0);
