import type { CollectionConfig } from "payload";
import { adminOnly, staffOnly } from "./access";
import { withReview } from "./workflow";

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

// Infrastructure only; applicant relationships/validation arrive in T07.
export const createPrivateFiles = (directory: string): CollectionConfig => ({
  slug: "private-files",
  admin: { useAsTitle: "filename", group: "Administration" },
  access: { read: staffOnly, create: adminOnly, update: adminOnly, delete: adminOnly },
  upload: { staticDir: directory, mimeTypes: ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    modifyResponseHeaders: ({ headers }) => { headers.set("Cache-Control", "private, no-store"); headers.set("X-Robots-Tag", "noindex, nofollow"); return headers; } },
  fields: [],
});
