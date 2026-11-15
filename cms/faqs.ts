import { APIError } from "payload";
import { lexicalEditor, ParagraphFeature, HeadingFeature, BoldFeature, ItalicFeature, OrderedListFeature, UnorderedListFeature, LinkFeature, FixedToolbarFeature } from "@payloadcms/richtext-lexical";
import { staffOnly } from "./access";
import { withReview } from "./workflow";
import { inspectArticleBody } from "./blog-content";

/** Deliberately private even after approval; no public FAQ integration. */
export const FAQs = withReview({
  slug: "faqs", labels: { singular: "FAQ", plural: "FAQs" },
  admin: { useAsTitle: "question", group: "Content", defaultColumns: ["question", "group", "sortOrder", "reviewState"], description: "Backend only. Approval does not make FAQs available to anonymous visitors." },
  access: { read: staffOnly },
  fields: [
    { name: "question", type: "text", required: true, maxLength: 500 },
    { name: "answer", type: "richText", required: true, editor: lexicalEditor({ features: [ParagraphFeature(), HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4"] }), BoldFeature(), ItalicFeature(), OrderedListFeature(), UnorderedListFeature(), LinkFeature({ enabledCollections: [], disableAutoLinks: true }), FixedToolbarFeature()] }) },
    { name: "group", type: "text", maxLength: 100 },
    { name: "sortOrder", type: "number", required: true, defaultValue: 0 },
  ], hooks: { beforeChange: [({ data, originalDoc, req }) => {
    if (req.context.reviewPublishing) {
      const body = inspectArticleBody(data.answer ?? originalDoc.answer);
      if (body.error || body.mediaIDs.length) throw new APIError(body.error ?? "FAQ answers cannot contain uploads.", 400);
    }
    return data;
  }] },
});
