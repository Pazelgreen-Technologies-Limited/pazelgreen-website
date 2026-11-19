import { APIError, type CollectionConfig, type Field, type GlobalConfig } from "payload";
import { sql } from "@payloadcms/db-postgres";
import { adminOnly, nobody } from "./access";
import { canAccessSection, sectionAccess } from "./permissions";
import { withGlobalReview } from "./global-review";
import { transactionDatabase } from "./transactions";
import { hiringStatuses } from "./recruitment-rules";
import { relationID } from "./blog-content";

export const RecruitmentSettings = withGlobalReview({
  slug: "recruitment-settings", admin: { group: "Careers", description: "Applications stay disabled until approved notice, version and retention duration are published. Obtain company/legal approval before enabling." },
  fields: [
    { name: "enabled", type: "checkbox", defaultValue: false },
    { name: "privacyNotice", type: "textarea", maxLength: 20000 },
    { name: "noticeVersion", type: "text", maxLength: 100 },
    { name: "retentionDays", type: "number", min: 1, max: 36500, admin: { description: "Company-approved duration; no default. Retention review dates are calculated on receipt. Deletion requires an authorized operational review." } },
  ], hooks: { beforeChange: [({ data, originalDoc, req }) => {
    const value = { ...originalDoc, ...data };
    if (req.context.reviewPublishing && value.enabled && (!value.privacyNotice?.trim() || !value.noticeVersion?.trim() || !Number.isInteger(value.retentionDays))) throw new APIError("Approve a recruitment privacy notice, version and retention duration before enabling applications.", 400);
    return data;
  }] },
});

export const RecruitmentDelivery: GlobalConfig = {
  slug: "recruitment-delivery", admin: { group: "Careers", description: "Private recipients. Run pnpm cms:deliver on a scheduler every minute. SMTP delivery is at least once." },
  access: { read: adminOnly, update: adminOnly },
  fields: [{ name: "recipients", type: "array", maxRows: 20, fields: [{ name: "email", type: "email", required: true }] }],
};

const immutable = (field: Field): Field => ({ ...field, admin: { ...field.admin, readOnly: true }, access: { create: () => false, update: () => false } } as Field);
export const Applications: CollectionConfig = {
  slug: "applications", admin: { useAsTitle: "reference", group: "Careers", defaultColumns: ["reference", "fullName", "job", "status", "duplicate", "candidateDelivery", "staffDelivery", "retentionReviewAt"] },
  access: { read: sectionAccess("recruitment"), create: nobody, update: sectionAccess("recruitment", "modify"), delete: nobody },
  indexes: [{ fields: ["job", "sequence"], unique: true }],
  fields: [
    ...([
      { name: "reference", type: "text", required: true, unique: true },
      { name: "job", type: "relationship", relationTo: "jobs", required: true, index: true },
      { name: "sequence", type: "number", required: true },
      { name: "submissionKey", type: "text", required: true, unique: true },
      { name: "fingerprint", type: "text", required: true },
      { name: "fullName", type: "text", required: true, maxLength: 160 },
      { name: "email", type: "email", required: true, index: true },
      { name: "phone", type: "text", maxLength: 50 },
      { name: "portfolio", type: "text", maxLength: 1000 },
      { name: "message", type: "textarea", maxLength: 4000 },
      { name: "cv", type: "upload", relationTo: "private-files", required: true },
      { name: "noticeVersion", type: "text", required: true },
      { name: "noticeSnapshot", type: "textarea", required: true },
      { name: "consentedAt", type: "date", required: true },
      { name: "retentionReviewAt", type: "date", required: true, index: true },
      { name: "duplicate", type: "checkbox", defaultValue: false },
      { name: "candidateDelivery", type: "select", defaultValue: "pending", options: ["pending", "sent", "failed"] },
      { name: "staffDelivery", type: "select", defaultValue: "pending", options: ["pending", "sent", "failed"] },
      { name: "deliveryAttempts", type: "number", defaultValue: 0 },
      { name: "nextDeliveryAt", type: "date", required: true },
    ] satisfies Field[]).map(immutable),
    { name: "status", type: "select", required: true, defaultValue: "new", options: [...hiringStatuses], index: true },
    { name: "assignedTo", type: "relationship", relationTo: "users" },
    { name: "notes", type: "textarea", maxLength: 20000 },
  ], hooks: {
    beforeOperation: [async ({ operation, req, args }) => {
      if (operation === "create" && !req.context.submitApplication) throw new APIError("Use the application form.", 403);
      if (operation === "update" && !req.context.deliverApplication) {
        if (!("id" in args) || !args.id) throw new APIError("Update applications individually.", 400);
        const tx = await req.transactionID;
        if (!tx) throw new APIError("Recruitment updates require transactions.", 503);
        await transactionDatabase(req.payload, tx).execute(sql`SELECT pg_advisory_xact_lock(hashtextextended(${`application:${args.id}`}, 0))`);
      }
    }],
    beforeChange: [async ({ data, req }) => {
      if (data.assignedTo && !req.context.deliverApplication) {
        const user = await req.payload.findByID({ collection: "users", id: relationID(data.assignedTo)!, req, overrideAccess: true });
        if (!canAccessSection(user, "recruitment")) throw new APIError("Assign an active colleague with recruitment access.", 400);
      }
      return data;
    }],
    afterChange: [async ({ doc, previousDoc, operation, req }) => {
      if (req.context.deliverApplication) return;
      if (operation === "create" || ["status", "notes", "assignedTo"].some(key => JSON.stringify(doc[key]) !== JSON.stringify(previousDoc?.[key]))) {
        await req.payload.create({ collection: "hiring-history", req, overrideAccess: true, data: {
          application: doc.id, actor: String(req.user?.id ?? "system"), status: doc.status, notes: doc.notes ?? "", assignee: String(relationID(doc.assignedTo) ?? ""),
        } });
      }
    }],
  },
};

export const HiringHistory: CollectionConfig = {
  slug: "hiring-history", admin: { group: "Careers", defaultColumns: ["application", "status", "actor", "createdAt"] },
  access: { read: sectionAccess("recruitment"), create: nobody, update: nobody, delete: nobody },
  fields: [
    { name: "application", type: "relationship", relationTo: "applications", required: true, index: true },
    { name: "actor", type: "text", required: true }, { name: "status", type: "text", required: true },
    { name: "notes", type: "textarea" }, { name: "assignee", type: "text" },
  ],
};
