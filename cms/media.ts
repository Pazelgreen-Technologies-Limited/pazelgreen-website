import type { CollectionConfig } from "payload";
import { adminOnly } from "./access";
import { sectionAccess } from "./permissions";
import { withReview } from "./workflow";
import { validateCV } from "./recruitment-rules";

export const createMedia = (directory: string): CollectionConfig => withReview({
  slug: "media",
  admin: { useAsTitle: "alt", group: "Content" },
  upload: { staticDir: directory, mimeTypes: ["image/jpeg", "image/png", "image/webp"], filesRequiredOnCreate: true,
    // Includes authenticated draft bytes; avoid shared caching before approval.
    modifyResponseHeaders: ({ headers }) => { headers.set("Cache-Control", "private, no-store"); return headers; } },
  fields: [
    { name: "alt", type: "text", required: true },
    { name: "caption", type: "text" },
    { name: "attribution", type: "text" },
  ],
});

export const createPrivateFiles = (directory: string): CollectionConfig => ({
  slug: "private-files",
  admin: { useAsTitle: "filename", group: "Administration" },
  access: { read: sectionAccess("recruitment"), create: adminOnly, update: adminOnly, delete: adminOnly },
  upload: { staticDir: directory, mimeTypes: ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    modifyResponseHeaders: ({ headers }) => { headers.set("Cache-Control", "private, no-store"); headers.set("X-Robots-Tag", "noindex, nofollow"); headers.set("X-Content-Type-Options", "nosniff"); headers.set("Content-Disposition", "attachment"); return headers; } },
  fields: [],
  hooks: { beforeOperation: [({ req, operation }) => {
    if (operation === "create" && req.file) {
      try { req.file.mimetype = validateCV(req.file.data, req.file.name); }
      catch { throw new Error("Upload a valid PDF or DOCX CV, no larger than 5 MB."); }
    }
    if (operation === "update" && req.file) throw new Error("Private CV files cannot be replaced.");
  }], afterChange: [({ doc, operation, req }) => {
    // Capture before the adapter uploads, including a write followed by timeout.
    if (operation === "create" && req.context.submitApplication) req.context.applicationUpload = { filename: doc.filename, prefix: doc.prefix, _objectKey: doc._objectKey };
  }], beforeDelete: [async ({ id, req }) => {
    const referenced = await req.payload.count({ collection: "applications", where: { cv: { equals: id } }, req, overrideAccess: true });
    if (referenced.totalDocs) throw new Error("Use the approved recruitment retention procedure to remove a referenced CV.");
  }] },
});
