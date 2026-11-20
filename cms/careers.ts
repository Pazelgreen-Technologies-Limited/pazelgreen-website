import { APIError, type CollectionConfig, type Field } from "payload";
import { sql } from "@payloadcms/db-postgres";
import { adminOnly, nobody } from "./access";
import { withReview } from "./workflow";
import { transactionDatabase } from "./transactions";
import { blogSlugPattern, relationID, slugFromTitle } from "./blog-content";
import { advertReference, advertYear, dictionaryCodePattern, validTimezone } from "./career-rules";

const dictionarySlugs = ["employment-types", "departments", "position-codes"] as const;
function dictionary(slug: typeof dictionarySlugs[number], label: string): CollectionConfig {
  return withReview({ slug, labels: { singular: label, plural: label === "Employment type" ? "Employment types" : `${label}s` },
    admin: { useAsTitle: "name", group: "Careers", defaultColumns: ["name", "code", "active", "reviewState"], description: "Administrators manage and approve codes. Retire entries instead of deleting them. Codes issued on adverts never change." },
    access: { create: adminOnly, update: adminOnly, delete: nobody },
    fields: [
      { name: "name", type: "text", required: true, maxLength: 120 },
      { name: "code", type: "text", required: true, unique: true, maxLength: 12,
        validate: (value: unknown) => typeof value === "string" && dictionaryCodePattern.test(value) || "Use 1–12 uppercase letters/numbers, starting with a letter. No separators or spaces." },
      { name: "active", type: "checkbox", required: true, defaultValue: true, label: "Available for new adverts" },
    ], hooks: { beforeValidate: [({ data }) => {
      if (typeof data?.code === "string") data.code = data.code.trim().toUpperCase();
      return data;
    }] },
  });
}
export const EmploymentTypes = dictionary("employment-types", "Employment type");
export const Departments = dictionary("departments", "Department");
export const PositionCodes = dictionary("position-codes", "Position code");

export const AnnualAdvertCounters: CollectionConfig = {
  slug: "annual-advert-counters", admin: { hidden: true },
  access: { create: nobody, read: nobody, update: nobody, delete: nobody },
  fields: [{ name: "year", type: "number", required: true, unique: true }, { name: "value", type: "number", required: true, min: 1 }],
  hooks: { beforeOperation: [({ operation }) => {
    if (["create", "update", "delete"].includes(operation)) throw new APIError("Advert counters are managed only by atomic publication.", 403);
  }] },
};

const referenceNames = ["reference", "referenceYear", "referenceSequence", "employmentCode", "departmentCode", "positionCodeSnapshot"] as const;
const referenceFields: Field[] = referenceNames.map((name): Field => {
  const common = { name, admin: { readOnly: true }, access: { create: () => false, update: () => false } };
  return name === "referenceYear" || name === "referenceSequence" ? { ...common, type: "number" } : { ...common, type: "text", unique: name === "reference" };
});
const definingFields = ["employmentType", "department", "positionCode"] as const;

export const Jobs: CollectionConfig = withReview({
  slug: "jobs", admin: { useAsTitle: "title", group: "Careers", defaultColumns: ["title", "reference", "state", "reviewState", "deadline"],
    preview: doc => doc.id ? `/join-us/careers/preview/${doc.id}` : null },
  indexes: [{ fields: ["referenceYear", "referenceSequence"], unique: true }],
  fields: [
    { name: "title", type: "text", required: true, maxLength: 180 },
    { name: "slug", type: "text", required: true, unique: true, maxLength: 120,
      validate: (value: unknown) => typeof value === "string" && blogSlugPattern.test(value) || "Use lowercase letters, numbers and single hyphens." },
    ...definingFields.map((name, index): Field => ({ name, type: "relationship", relationTo: dictionarySlugs[index], required: true, maxDepth: 1,
      admin: { description: "Choose a published, active code. Locked permanently after first approval. Retired codes remain selectable for existing adverts only." } })),
    { name: "location", type: "text", required: true, maxLength: 180 },
    { name: "arrangement", type: "select", required: true, options: ["remote", "hybrid", "on-site"] },
    { name: "summary", type: "textarea", required: true, maxLength: 1200 },
    { name: "responsibilities", type: "textarea", required: true, maxLength: 12000, admin: { description: "Plain text; put each responsibility on its own line." } },
    { name: "requirements", type: "textarea", required: true, maxLength: 12000, admin: { description: "Plain text; put each requirement on its own line." } },
    { name: "compensation", type: "text", maxLength: 300 },
    { name: "deadline", type: "date", admin: { date: { pickerAppearance: "dayAndTime" }, description: "Exact closing instant, stored in UTC. Enter an explicit offset when using the API. The timezone below controls public display. Empty means no deadline." } },
    { name: "deadlineTimezone", type: "text", defaultValue: "Africa/Lagos", required: true, validate: validTimezone },
    { name: "state", type: "select", required: true, defaultValue: "open", options: ["open", "closed"], admin: { description: "Closing or reopening requires admin approval. Deadlines apply automatically." } },
    ...referenceFields,
    { name: "seo", type: "group", fields: [{ name: "title", type: "text", maxLength: 100 }, { name: "description", type: "textarea", maxLength: 300 }] },
  ],
  hooks: {
    beforeValidate: [({ data, operation }) => {
      if (!data) return data;
      if (typeof data.slug === "string") data.slug = data.slug.trim().toLowerCase();
      else if (operation === "create") data.slug = slugFromTitle(String(data.title ?? ""));
      return data;
    }],
    beforeChange: [async ({ data, originalDoc, req, operation }) => {
      // The parent row is authoritative, even if a later draft is being edited.
      const issued = operation === "update" ? await req.payload.findByID({ collection: "jobs", id: originalDoc.id, draft: false, overrideAccess: true, depth: 0, req }) : undefined;
      for (const name of referenceNames) data[name] = issued?.[name] ?? null;
      if (issued?.reference) {
        for (const name of definingFields) {
          if (relationID(data[name] ?? originalDoc[name]) !== relationID(issued[name])) throw new APIError("Reference-defining codes are locked after first publication. Create a new advert for a different vacancy.", 409);
        }
      }
      if (!req.context.reviewPublishing) return data;
      const job = { ...originalDoc, ...data };
      for (const name of ["title", "location", "summary", "responsibilities", "requirements"] as const) {
        if (typeof job[name] !== "string" || !job[name].trim()) throw new APIError(`Provide ${name} before approval.`, 400);
      }
      if (!issued?.reference) {
        const codes: string[] = [];
        for (let index = 0; index < definingFields.length; index++) {
          const id = relationID(job[definingFields[index]]);
          if (!id) throw new APIError("Choose all three reference codes.", 400);
          const record = await req.payload.findByID({ collection: dictionarySlugs[index], id, draft: false, overrideAccess: true, depth: 0, req });
          if (record._status !== "published" || !record.active) throw new APIError("Publish and activate every selected dictionary entry before approving a new advert.", 409);
          codes.push(record.code);
        }
        const transaction = await req.transactionID;
        if (!transaction) throw new APIError("Advert allocation requires a database transaction.", 503);
        const year = advertYear();
        const result = await transactionDatabase(req.payload, transaction).execute(sql`
          INSERT INTO annual_advert_counters (year, value, created_at, updated_at) VALUES (${year}, 1, NOW(), NOW())
          ON CONFLICT (year) DO UPDATE SET value = annual_advert_counters.value + 1, updated_at = NOW() RETURNING value`);
        const sequence = Number(result.rows[0].value);
        data.reference = advertReference(codes[0], codes[1], codes[2], year, sequence);
        data.referenceYear = year; data.referenceSequence = sequence;
        data.employmentCode = codes[0]; data.departmentCode = codes[1]; data.positionCodeSnapshot = codes[2];
      }
      return data;
    }],
    beforeDelete: [async ({ id, req }) => {
      const job = await req.payload.findByID({ collection: "jobs", id, draft: false, overrideAccess: true, depth: 0, req });
      if (job.reference) throw new APIError("Issued adverts cannot be deleted. Close or unpublish them to preserve permanent references.", 409);
    }],
  },
});
