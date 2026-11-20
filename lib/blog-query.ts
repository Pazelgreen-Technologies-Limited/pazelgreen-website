import { blogSlugPattern } from "../cms/blog-content";

export const blogPageSize = 6;
export type BlogSearch = { page?: string | string[]; category?: string | string[] };

export function parseBlogSearch(search: BlogSearch) {
  if (Array.isArray(search.page) || Array.isArray(search.category)) return null;
  const page = search.page ?? "1";
  if (!/^[1-9]\d{0,5}$/.test(page)) return null;
  const category = search.category || undefined;
  if (category && (category.length > 120 || !blogSlugPattern.test(category))) return null;
  return { page: Number(page), category };
}

export function blogListingURL(page = 1, category?: string) {
  const search = new URLSearchParams();
  if (category) search.set("category", category);
  if (page > 1) search.set("page", String(page));
  return `/blog${search.size ? `?${search}` : ""}`;
}
