import { APIError, type CollectionConfig, type Field, type PayloadRequest } from "payload";
import { sql } from "@payloadcms/db-postgres";
import { adminOnly, isAdmin, isStaff, publishedOrStaff, staffOnly } from "./access";
import { audit } from "./audit";
import { transactionDatabase } from "./transactions";

const systemFields = new Set(["id", "createdAt", "updatedAt", "_status", "reviewState", "reviewNote", "createdBy", "modifiedBy", "reviewedBy", "publishedBy", "submittedAt", "reviewedAt", "publishedAt"]);
function contentChanged(data: Record<string, unknown>, original: Record<string, unknown>, upload: boolean) {
  // Payload normalizes stored relative media URLs into absolute response URLs.
  // Ignore those derived fields only on uploads; a content link must be reviewed.
  return Object.keys(data).some((key) => !systemFields.has(key) && !(upload && ["url", "thumbnailURL"].includes(key)) && JSON.stringify(data[key]) !== JSON.stringify(original[key]));
}

const auditFields: Field[] = [
  { name: "reviewState", type: "select", defaultValue: "draft", required: true,
    options: ["draft", "in-review", "changes-requested", "published"] },
  { name: "reviewNote", type: "textarea", admin: { description: "Required when returning a draft for changes." } },
  ...["createdBy", "modifiedBy", "reviewedBy", "publishedBy"].map((name): Field => ({ name, type: "text", admin: { readOnly: true } })),
  ...["submittedAt", "reviewedAt", "publishedAt"].map((name): Field => ({ name, type: "date", admin: { readOnly: true } })),
];

/** Apply to every later public content collection. All drafts stay authenticated. */
export function withReview(config: CollectionConfig): CollectionConfig {
  return {
    ...config,
    versions: { drafts: true, maxPerDoc: 0 },
    access: { create: staffOnly, read: publishedOrStaff, update: staffOnly, delete: adminOnly, readVersions: staffOnly, ...config.access },
    fields: [...config.fields, ...auditFields.map((field) => ({ ...field, access: { read: ({ req }: { req: PayloadRequest }) => isStaff(req.user) } }))],
    hooks: {
      ...config.hooks,
      beforeOperation: [async ({ args, operation, req }) => {
        if (operation === "restoreVersion") throw new APIError("Copy historical content into a new draft and submit it for review.", 403);
        if (operation === "create" || operation === "update") {
          if (!isStaff(req.user)) throw new APIError("An active CMS account is required.", 403);
          if (operation === "update") {
            if (!("id" in args) || !args.id) throw new APIError("Review content one document at a time.", 400);
            const transaction = await req.transactionID;
            if (!transaction) throw new APIError("Review changes require a database transaction.", 503);
            // Serialize edits/submission/publication before Payload loads the latest version.
            await transactionDatabase(req.payload, transaction).execute(sql`SELECT pg_advisory_xact_lock(hashtextextended(${`${config.slug}:${args.id}`}, 0))`);
          }
          const data = "data" in args ? args.data : undefined;
          const requestedPublish = data && typeof data === "object" && "_status" in data && data._status === "published" && !("draft" in args && args.draft);
          const requestedUnpublish = operation === "update" && data && typeof data === "object" && "_status" in data && data._status === "draft" && !("draft" in args && args.draft) && isAdmin(req.user);
          if (requestedPublish && !isAdmin(req.user)) throw new APIError("Only administrators can publish.", 403);
          req.context.reviewPublishing = Boolean(requestedPublish);
          req.context.reviewUnpublishing = Boolean(requestedUnpublish);
          // Media bytes cannot be changed behind an already issued public URL.
          if (operation === "update" && req.file) throw new APIError("Upload a new media record rather than replacing an existing file.", 400);
          if (requestedUnpublish) return { ...args, draft: false };
          if (!requestedPublish) return { ...args, draft: true, data: { ...data, _status: "draft" } };
        }
        return args;
      }, ...(config.hooks?.beforeOperation ?? [])],
      beforeChange: [({ data, originalDoc, operation, req }) => {
        const original = originalDoc ?? {};
        const changed = operation === "create" || contentChanged(data, original, Boolean(config.upload));
        const requestedState = data.reviewState ?? original.reviewState ?? "draft";
        const publishing = Boolean(req.context.reviewPublishing);
        if (req.context.reviewUnpublishing) {
          if (!isAdmin(req.user)) throw new APIError("Only administrators can unpublish content.", 403);
          data.reviewState = "draft";
          data._status = "draft";
        } else if (publishing) {
          if (!isAdmin(req.user) || original.reviewState !== "in-review" || changed) {
            throw new APIError("Publish an unchanged draft that has been submitted for review.", 409);
          }
          data.reviewState = "published";
          data._status = "published";
        } else {
          data._status = "draft";
          if (requestedState === "published") data.reviewState = "draft";
          else if (requestedState === "changes-requested") {
            if (!isAdmin(req.user)) throw new APIError("Only administrators can return drafts for changes.", 403);
            if (!data.reviewNote?.trim()) throw new APIError("Provide a note explaining the requested changes.", 400);
            data.reviewState = "changes-requested";
          } else if (changed && original.reviewState === "in-review") data.reviewState = "draft";
          else data.reviewState = requestedState;
        }
        const now = new Date().toISOString();
        const actor = String(req.user!.id);
        data.createdBy = original.createdBy ?? actor;
        data.modifiedBy = actor;
        data.submittedAt = data.reviewState === "in-review" && original.reviewState !== "in-review" ? now : original.submittedAt ?? null;
        data.reviewedBy = publishing || data.reviewState === "changes-requested" ? actor : original.reviewedBy ?? null;
        data.reviewedAt = publishing || data.reviewState === "changes-requested" ? now : original.reviewedAt ?? null;
        data.publishedBy = publishing ? actor : original.publishedBy ?? null;
        data.publishedAt = publishing ? now : original.publishedAt ?? null;
        return data;
      }, ...(config.hooks?.beforeChange ?? [])],
      afterChange: [async ({ doc, req }) => {
        await audit(req, req.context.reviewUnpublishing ? "content.unpublished" : `content.${doc.reviewState}`, `${config.slug}:${doc.id}`);
      }, ...(config.hooks?.afterChange ?? [])],
      beforeDelete: [async ({ id, req }) => { await audit(req, "content.deleted", `${config.slug}:${id}`); }, ...(config.hooks?.beforeDelete ?? [])],
    },
  };
}
