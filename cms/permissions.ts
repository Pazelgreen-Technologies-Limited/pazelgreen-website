import type { Access, Field } from "payload";
import type { User } from "../payload-types";

export const sections = {
  blog: "Blog (posts and categories)",
  media: "Media library",
  careers: "Careers (jobs and recruitment settings)",
  recruitment: "Recruitment (applications, CVs and hiring history)",
  company: "Company details",
  seo: "Page SEO",
  faqs: "Internal FAQs",
  announcements: "Announcements",
  legal: "Legal pages",
} as const;
export type Section = keyof typeof sections;
export const allSectionPermissions = Object.fromEntries(Object.keys(sections).map(key => [key, "modify"])) as Record<Section, "modify">;

type PermissionUser = Pick<Partial<User>, "active" | "mustChangePassword" | "role" | "permissions"> & { id?: number | string };

export function canAccessSection(user: PermissionUser | null | undefined, section: Section, action: "read" | "modify" = "read") {
  if (!user?.active || user.mustChangePassword) return false;
  if (user.role === "admin") return true;
  if (user.role !== "staff") return false;
  const level = user.permissions?.[section];
  return level === "modify" || (action === "read" && level === "read");
}

export const sectionAccess = (section: Section, action: "read" | "modify" = "read"): Access =>
  ({ req }) => canAccessSection(req.user, section, action);

export const contentSections: Record<string, Section> = {
  posts: "blog", categories: "blog", media: "media", jobs: "careers",
  "employment-types": "careers", departments: "careers", "position-codes": "careers",
  "company-settings": "company", "page-seo": "seo", "recruitment-settings": "careers",
  faqs: "faqs", announcements: "announcements", "legal-pages": "legal",
};

export function contentSection(slug: string): Section {
  const section = contentSections[slug];
  if (!section) throw new Error(`No section permission configured for ${slug}.`);
  return section;
}

export function permissionField(): Field {
  return {
    name: "permissions", type: "group", label: "Staff section permissions",
    admin: { description: "Modify includes viewing and editing every record in a section. Staff cannot publish, delete content or manage users. Admins always have full access. Blog editors need Media access to select library images; Modify Media also permits uploads." },
    access: {
      create: ({ req }) => Boolean(req.user?.active && !req.user.mustChangePassword && req.user.role === "admin"),
      update: ({ req }) => Boolean(req.user?.active && !req.user.mustChangePassword && req.user.role === "admin"),
    },
    fields: Object.entries(sections).map(([name, label]): Field => ({
      name, label, type: "select", defaultValue: "none",
      options: [{ label: "No access", value: "none" }, { label: "View", value: "read" }, { label: "Modify", value: "modify" }],
    })),
  };
}
