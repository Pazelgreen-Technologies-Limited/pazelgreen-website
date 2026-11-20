/** Shared validation for saved article content and its public renderer. */
export const blogSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugFromTitle(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 120).replace(/-$/, "");
}

export function safeArticleURL(value: unknown) {
  if (typeof value !== "string" || !value || /[\u0000-\u0020\\]/.test(value)) return false;
  if (value.startsWith("#")) return true;
  if (value.startsWith("/")) return !value.startsWith("//");
  try { return ["http:", "https:", "mailto:", "tel:"].includes(new URL(value).protocol); }
  catch { return false; }
}

export function relationID(value: unknown): number | undefined {
  const id = value && typeof value === "object" && "id" in value ? value.id : value;
  const numeric = typeof id === "string" && /^\d+$/.test(id) ? Number(id) : id;
  return typeof numeric === "number" && Number.isSafeInteger(numeric) && numeric > 0 ? numeric : undefined;
}

const allowedNodes = new Set(["root", "paragraph", "text", "linebreak", "heading", "list", "listitem", "quote", "link", "autolink", "upload"]);

export function inspectArticleBody(body: unknown): { mediaIDs: number[]; error?: string } {
  const media = new Set<number>();
  let count = 0;
  let characters = 0;
  let hasContent = false;
  function visit(value: unknown, depth: number): string | undefined {
    if (++count > 5000 || depth > 30) return "Article content is too large or deeply nested.";
    if (!value || typeof value !== "object" || !("type" in value) || typeof value.type !== "string" || !allowedNodes.has(value.type)) return "Use the supported article editor formatting.";
    const node = value as Record<string, unknown>;
    if (node.type === "text") {
      if (typeof node.text !== "string") return "Article text is invalid.";
      characters += node.text.length;
      if (characters > 200000) return "Article text must contain no more than 200,000 characters.";
      hasContent ||= Boolean(node.text.trim());
    }
    if (node.type === "heading" && !["h2", "h3", "h4"].includes(String(node.tag))) return "Use level 2, 3 or 4 headings inside articles.";
    if (["root", "paragraph", "heading", "list", "listitem", "quote", "link", "autolink"].includes(String(node.type)) && !Array.isArray(node.children)) return "Article content is invalid.";
    if (node.type === "list" && (!["ul", "ol"].includes(String(node.tag)) || !["bullet", "number"].includes(String(node.listType)))) return "Use a numbered or bulleted list.";
    if (node.type === "link" || node.type === "autolink") {
      const fields = node.fields as Record<string, unknown> | undefined;
      if (!fields || fields.linkType === "internal" || !safeArticleURL(fields.url)) return "Article links must use a safe website, email, phone or relative URL.";
    }
    if (node.type === "upload") {
      const id = relationID(node.value);
      if (node.relationTo !== "media" || !id) return "Inline images must come from the public media library.";
      media.add(id);
      hasContent = true;
    }
    if (node.children !== undefined) {
      if (!Array.isArray(node.children)) return "Article content is invalid.";
      for (const child of node.children) { const error = visit(child, depth + 1); if (error) return error; }
    }
    return undefined;
  }
  const root = body && typeof body === "object" && "root" in body ? body.root : undefined;
  if (!root || typeof root !== "object" || !("type" in root) || root.type !== "root") return { mediaIDs: [], error: "Add valid article content before publishing." };
  const error = visit(root, 0);
  return { mediaIDs: [...media], error: error ?? (!hasContent ? "Add article text or an image before publishing." : undefined) };
}
