import { describe, expect, it } from "vitest";
import { inspectArticleBody, relationID, safeArticleURL, slugFromTitle } from "../../cms/blog-content";
import { blogListingURL, parseBlogSearch } from "../../lib/blog-query";

const text = (value: string) => ({ type: "text", text: value });
const body = (children: unknown[]) => ({ root: { type: "root", children } });

describe("blog URLs and pagination", () => {
  it("normalizes titles and preserves a category when changing page", () => {
    expect(slugFromTitle("  Café & Farming: A Better Future!  ")).toBe("cafe-farming-a-better-future");
    expect(blogListingURL(2, "food-systems")).toBe("/blog?category=food-systems&page=2");
    expect(blogListingURL(1)).toBe("/blog");
    expect(parseBlogSearch({})).toEqual({ page: 1, category: undefined });
  });
  it.each([{ page: "0" }, { page: "-1" }, { page: "1.5" }, { page: "1e3" }, { page: ["1", "2"] }, { category: ["a", "b"] }, { category: "bad/slug" }, { page: "9999999" }])("rejects malformed query parameters: %j", query => {
    expect(parseBlogSearch(query)).toBeNull();
  });
});

describe("article content boundaries", () => {
  it.each(["https://example.com/research", "http://example.com", "mailto:hello@example.com", "tel:+2348000000000", "/blog/story", "#research"])("allows a useful safe link: %s", value => expect(safeArticleURL(value)).toBe(true));
  it.each(["javascript:alert(1)", "data:text/html,<script>bad</script>", "//evil.example", "/\\evil.example", " https://example.com", "java\nscript:alert(1)", ""])("rejects unsafe links: %s", value => expect(safeArticleURL(value)).toBe(false));
  it("deduplicates real media IDs and rejects private-file relationships", () => {
    expect(inspectArticleBody(body([text("A field update"), { type: "upload", relationTo: "media", value: 8 }, { type: "upload", relationTo: "media", value: { id: 8, url: "https://untrusted.example" } }]))).toEqual({ mediaIDs: [8], error: undefined });
    expect(inspectArticleBody(body([{ type: "upload", relationTo: "private-files", value: 8 }])).error).toMatch(/public media/);
    expect(relationID({ id: "8" })).toBe(8);
    expect(relationID("not-a-number")).toBeUndefined();
  });
  it("rejects empty, malformed, unsupported and overly nested content", () => {
    expect(inspectArticleBody(body([])).error).toMatch(/Add article/);
    expect(inspectArticleBody({ root: text("Not a root") }).error).toBeTruthy();
    expect(inspectArticleBody(body([{ type: "html", html: "<script>bad</script>" }])).error).toMatch(/supported/);
    expect(inspectArticleBody(body([{ type: "heading", tag: "script", children: [text("Bad")] }])).error).toMatch(/headings/);
    expect(inspectArticleBody(body([{ type: "list", tag: "script", listType: "bullet", children: [] }])).error).toMatch(/list/);
    expect(inspectArticleBody(body([text("x".repeat(200001))])).error).toMatch(/200,000/);
    let nested: unknown = text("Too deep");
    for (let index = 0; index < 35; index++) nested = { type: "paragraph", children: [nested] };
    expect(inspectArticleBody(body([nested])).error).toMatch(/deeply/);
    expect(inspectArticleBody(body(Array.from({ length: 5001 }, () => text("Large")))) .error).toMatch(/large/);
  });
});
