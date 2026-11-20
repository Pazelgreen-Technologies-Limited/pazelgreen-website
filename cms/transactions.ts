import type { PostgresAdapter } from "@payloadcms/db-postgres";
import type { Payload } from "payload";

/** Payload stores adapter-specific transaction handles as unknown. */
export function transactionDatabase(payload: Payload, id: number | string) {
  const session = payload.db.sessions?.[id];
  if (!session?.db) throw new Error("PostgreSQL transaction is unavailable.");
  return session.db as PostgresAdapter["drizzle"];
}
