import { createLocalReq, type Payload } from "payload";
import { sql } from "@payloadcms/db-postgres";
import { transactionDatabase } from "./transactions";

/** Idempotent across restarts and concurrent application processes. */
export async function ensureFirstAdmin(payload: Payload, source: Record<string, string | undefined> = process.env) {
  const transaction = await payload.db.beginTransaction();
  if (!transaction) throw new Error("Bootstrap requires a database transaction.");
  try {
    await transactionDatabase(payload, transaction).execute(sql`SELECT pg_advisory_xact_lock(812731)`);
    const req = await createLocalReq({ context: { bootstrapAdmin: true } }, payload);
    req.transactionID = transaction;
    const admins = await payload.count({ collection: "users", where: { role: { equals: "admin" } }, overrideAccess: true, req });
    if (admins.totalDocs) {
      await payload.db.commitTransaction(transaction);
      return false;
    }
    const email = source.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
    const password = source.BOOTSTRAP_ADMIN_PASSWORD;
    if (!email || !password || password.length < 12 || password.length > 256) {
      throw new Error("No administrator exists. Set BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD (12–256 characters) in server environment secrets.");
    }
    const existing = await payload.count({ collection: "users", where: { email: { equals: email } }, overrideAccess: true, req });
    if (existing.totalDocs) throw new Error("Bootstrap email belongs to an existing account. Choose a different bootstrap email; existing accounts are never promoted automatically.");
    await payload.create({ collection: "users", data: { name: "Administrator", email, password, role: "admin", active: true, mustChangePassword: true }, overrideAccess: true, req });
    await payload.db.commitTransaction(transaction);
    return true;
  } catch (error) {
    await payload.db.rollbackTransaction(transaction);
    throw error;
  }
}
