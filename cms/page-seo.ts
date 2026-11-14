import type { GlobalConfig } from "payload";
import { withGlobalReview } from "./global-review";

export const staticPages = {
  home: { path: "/", label: "Home" },
  about: { path: "/about", label: "About" },
  solutions: { path: "/solutions", label: "Solutions" },
  joinUs: { path: "/join-us", label: "Join Us" },
  contact: { path: "/contact", label: "Contact" },
} as const;
export type StaticPage = keyof typeof staticPages;

export const PageSEO: GlobalConfig = withGlobalReview({
  slug: "page-seo",
  label: "Page SEO",
  admin: { group: "Website", description: "Search titles and descriptions for existing public pages. Homepage content is not editable here." },
  fields: Object.entries(staticPages).map(([name, page]) => ({
    name, type: "group", label: `${page.label} (${page.path})`, fields: [
      { name: "title", type: "text", maxLength: 100 },
      { name: "description", type: "textarea", maxLength: 300 },
    ],
  })),
});
