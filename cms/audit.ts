import type { CollectionConfig, PayloadRequest } from "payload";
import { adminOnly, nobody } from "./access";

export const AuditEvents: CollectionConfig = {
  slug: "audit-events",
  admin: { useAsTitle: "action", group: "Administration" },
  access: { create: nobody, read: adminOnly, update: nobody, delete: nobody },
  fields: [
    { name: "action", type: "text", required: true },
    { name: "subject", type: "text", required: true },
    // Snapshot identifiers survive user deletion; no applicant data or secrets.
    { name: "actor", type: "text", required: true },
    { name: "occurredAt", type: "date", required: true },
  ],
};

export async function audit(req: PayloadRequest, action: string, subject: string) {
  await req.payload.create({
    collection: "audit-events", overrideAccess: true, req,
    data: { action, subject, actor: String(req.user?.id ?? "system"), occurredAt: new Date().toISOString() },
  });
}
