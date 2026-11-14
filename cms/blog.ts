import { APIError, type CollectionConfig, type Field } from "payload";
import { lexicalEditor, ParagraphFeature, HeadingFeature, BoldFeature, ItalicFeature, UnderlineFeature, BlockquoteFeature, OrderedListFeature, UnorderedListFeature, LinkFeature, UploadFeature, FixedToolbarFeature, InlineToolbarFeature } from "@payloadcms/richtext-lexical";
import { withReview } from "./workflow";
import { blogSlugPattern, inspectArticleBody, relationID, slugFromTitle } from "./blog-content";

const slugField: Field = {
  name: "slug", type: "text", required: true, unique: true, index: true, maxLength: 120,
  admin: { description: "URL address, for example reducing-food-waste. Changing a published slug changes its public address." },
  validate: (value: unknown) => typeof value === "string" && blogSlugPattern.test(value) || "Use lowercase letters, numbers and single hyphens.",
};

const normalizeSlug: NonNullable<NonNullable<CollectionConfig["hooks"]>["beforeValidate"]>[number] = ({ data, operation }) => {
  if (!data) return data;
  if (typeof data.slug === "string") data.slug = data.slug.trim().toLowerCase();
  else if (operation === "create") data.slug = slugFromTitle(String(data.title ?? data.name ?? ""));
  return data;
};

export const Categories: CollectionConfig = withReview({
  slug: "categories", admin: { useAsTitle: "name", group: "Blog", defaultColumns: ["name", "slug", "reviewState", "updatedAt"] },
  fields: [
    { name: "name", type: "text", required: true, maxLength: 100 },
    { ...slugField },
    { name: "description", type: "textarea", maxLength: 500 },
  ],
  hooks: { beforeValidate: [normalizeSlug] },
});

export const Posts: CollectionConfig = withReview({
  slug: "posts",
  admin: { useAsTitle: "title", group: "Blog", defaultColumns: ["title", "authorName", "reviewState", "publicationDate"],
    preview: doc => doc.id ? `/blog/preview/${encodeURIComponent(String(doc.id))}` : null },
  fields: [
    { name: "title", type: "text", required: true, maxLength: 180 },
    { ...slugField },
    { name: "excerpt", type: "textarea", required: true, maxLength: 500 },
    { name: "authorName", type: "text", required: true, maxLength: 120, label: "Public author name", admin: { description: "Public attribution, independent of private CMS user accounts." } },
    { name: "publicationDate", type: "date", required: true, defaultValue: () => new Date().toISOString(), admin: { description: "Date displayed on the article. This is not a scheduling control; approval publishes immediately." } },
    { name: "categories", type: "relationship", relationTo: "categories", hasMany: true, maxDepth: 1 },
    { name: "coverImage", type: "upload", relationTo: "media", maxDepth: 1 },
    { name: "body", type: "richText", required: true,
      editor: lexicalEditor({ features: [ParagraphFeature(), HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4"] }), BoldFeature(), ItalicFeature(), UnderlineFeature(), BlockquoteFeature(), OrderedListFeature(), UnorderedListFeature(), LinkFeature({ enabledCollections: [], disableAutoLinks: true }), UploadFeature({ enabledCollections: ["media"], maxDepth: 1 }), FixedToolbarFeature(), InlineToolbarFeature()] }) },
    { name: "seo", type: "group", fields: [
      { name: "title", type: "text", maxLength: 100 }, { name: "description", type: "textarea", maxLength: 300 },
    ] },
  ],
  hooks: {
    beforeValidate: [normalizeSlug],
    beforeChange: [async ({ data, originalDoc, req }) => {
      if (!req.context.reviewPublishing) return data;
      const article = { ...originalDoc, ...data };
      const body = inspectArticleBody(article.body);
      if (body.error) throw new APIError(body.error, 400);
      const mediaIDs = new Set(body.mediaIDs);
      const cover = relationID(article.coverImage);
      if (article.coverImage && !cover) throw new APIError("Choose a valid cover image.", 400);
      if (cover) mediaIDs.add(cover);
      const categoryIDs = new Set<number | undefined>((Array.isArray(article.categories) ? article.categories : []).map(relationID));
      for (const [collection, ids] of [["media", mediaIDs], ["categories", categoryIDs]] as const) {
        const validIDs = [...ids].filter((id): id is number => typeof id === "number");
        if (validIDs.length !== ids.size) throw new APIError("Choose valid public categories and images.", 400);
        if (!validIDs.length) continue;
        const records = await req.payload.find({ collection, where: { and: [{ id: { in: validIDs } }, { _status: { equals: "published" } }] },
          limit: validIDs.length, draft: false, overrideAccess: true, depth: 0, req });
        if (records.docs.length !== validIDs.length) throw new APIError("Publish every referenced category and image before publishing the article.", 409);
      }
      return data;
    }],
  },
});
