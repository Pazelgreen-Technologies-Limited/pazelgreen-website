import { APIError, type GlobalConfig, type PayloadRequest } from "payload";
import { sql } from "@payloadcms/db-postgres";
import { isAdmin, isStaff, publishedOrStaff, staffOnly } from "./access";
import { audit } from "./audit";
import { applyReviewChange, auditFields } from "./workflow";
import { transactionDatabase } from "./transactions";

/** Globals use the same review transitions as collections, with singleton locks. */
export function withGlobalReview(config: GlobalConfig): GlobalConfig {
  return {
    ...config,
    versions: { drafts: true, max: 0 },
    access: { read: publishedOrStaff, update: staffOnly, readVersions: staffOnly },
    fields: [...config.fields, ...auditFields.map(field => ({ ...field, access: { read: ({ req }: { req: PayloadRequest }) => isStaff(req.user) } }))],
    hooks: {
      ...config.hooks,
      beforeOperation: [async ({ args, operation, req }) => {
        if (operation === "restoreVersion") throw new APIError("Copy historical content into a new draft and submit it for review.", 403);
        if (operation === "read" && args?.draft && !isStaff(req.user)) throw new APIError("Drafts require an active CMS account.", 403);
        if (operation !== "update") return args;
        if (!isStaff(req.user)) throw new APIError("An active CMS account is required.", 403);
        const transaction = await req.transactionID;
        if (!transaction) throw new APIError("Review changes require a database transaction.", 503);
        await transactionDatabase(req.payload, transaction).execute(sql`SELECT pg_advisory_xact_lock(hashtextextended(${`global:${config.slug}`}, 0))`);
        const publishing = args.data?._status === "published" && !args.draft;
        const unpublishing = args.data?._status === "draft" && !args.draft && isAdmin(req.user);
        if (publishing && !isAdmin(req.user)) throw new APIError("Only administrators can publish.", 403);
        req.context.reviewPublishing = publishing;
        req.context.reviewUnpublishing = unpublishing;
        if (unpublishing || publishing) return args;
        return { ...args, draft: true, publishAllLocales: false, data: { ...args.data, _status: "draft" } };
      }, ...(config.hooks?.beforeOperation ?? [])],
      beforeChange: [({ data, originalDoc, req }) => applyReviewChange({ data, originalDoc, operation: "update", req }), ...(config.hooks?.beforeChange ?? [])],
      afterChange: [async ({ doc, req }) => {
        await audit(req, req.context.reviewUnpublishing ? "content.unpublished" : `content.${doc.reviewState}`, `globals:${config.slug}`);
      }, ...(config.hooks?.afterChange ?? [])],
    },
  };
}
