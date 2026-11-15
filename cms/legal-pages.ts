import { APIError } from "payload";
import { sql } from "@payloadcms/db-postgres";
import { lexicalEditor, ParagraphFeature, HeadingFeature, BoldFeature, ItalicFeature, UnderlineFeature, BlockquoteFeature, OrderedListFeature, UnorderedListFeature, LinkFeature, FixedToolbarFeature } from "@payloadcms/richtext-lexical";
import { withReview } from "./workflow";
import { nobody } from "./access";
import { inspectArticleBody } from "./blog-content";
import { transactionDatabase } from "./transactions";

export const LegalPages = withReview({
  slug: "legal-pages", admin: { useAsTitle: "title", group: "Website", defaultColumns: ["title", "identity", "effectiveDate", "reviewState"], description: "Fixed privacy policy and terms documents. Company-approved copy is required before launch; no policy is seeded. Effective date is displayed metadata, not scheduling.", preview: doc => doc.id ? `/legal/preview/${doc.id}` : null },
  access: { delete: nobody },
  fields: [
    { name: "identity", type: "select", required: true, unique: true, options: ["privacy-policy", "terms-of-service"], access: { update: () => false }, admin: { description: "Permanent page identity. Create each page once, then edit its existing document." } },
    { name: "title", type: "text", required: true, maxLength: 180 },
    { name: "body", type: "richText", required: true, editor: lexicalEditor({ features: [ParagraphFeature(), HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4"] }), BoldFeature(), ItalicFeature(), UnderlineFeature(), BlockquoteFeature(), OrderedListFeature(), UnorderedListFeature(), LinkFeature({ enabledCollections: [], disableAutoLinks: true }), FixedToolbarFeature()] }) },
    { name: "effectiveDate", type: "text", required: true, admin: { description: "Calendar date YYYY-MM-DD; no timezone or automatic activation." }, validate: (value: unknown) => {
      if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Use YYYY-MM-DD.";
      const date = new Date(`${value}T00:00:00Z`);
      return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value || "Choose a valid calendar date.";
    } },
    { name: "seo", type: "group", fields: [{ name: "title", type: "text", maxLength: 100 }, { name: "description", type: "textarea", maxLength: 300 }] },
  ], hooks: {
    beforeOperation: [async ({ operation, args, req }) => {
      if (operation !== "create") return;
      const identity = "data" in args ? args.data?.identity : undefined;
      if (identity !== "privacy-policy" && identity !== "terms-of-service") throw new APIError("Choose a fixed legal page identity.", 400);
      const tx = await req.transactionID;
      if (!tx) throw new APIError("Legal page creation requires a transaction.", 503);
      const db = transactionDatabase(req.payload, tx);
      await db.execute(sql`SELECT pg_advisory_xact_lock(hashtextextended(${`legal:${identity}`}, 0))`);
      const existing = await db.execute(sql`SELECT id FROM legal_pages WHERE identity = ${identity} UNION SELECT parent_id AS id FROM _legal_pages_v WHERE version_identity = ${identity} AND latest = true LIMIT 1`);
      if (existing.rows.length) throw new APIError("This legal page already exists. Edit its existing document.", 409);
    }],
    beforeChange: [({ data, originalDoc, operation, req }) => {
      if (operation === "update" && data.identity && data.identity !== originalDoc.identity) throw new APIError("Legal page identity is permanent.", 409);
      if (req.context.reviewPublishing) {
        const body = inspectArticleBody(data.body ?? originalDoc.body);
        if (body.error || body.mediaIDs.length) throw new APIError(body.error ?? "Legal content cannot contain uploads.", 400);
        if (!(data.title ?? originalDoc.title)?.trim()) throw new APIError("Provide an approved legal page title.", 400);
      }
      return data;
    }],
  },
});
