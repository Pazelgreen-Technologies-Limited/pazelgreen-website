import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import type { CompanySetting } from "@/payload-types";

// Existing site values are display fallbacks, not verified production seed data.
export const existingCompany = {
  email: "Pazelgreentech@gmail.com", phone: "+234 813 381 1594", address: "Ikorodu, Lagos Nigeria",
  timezone: "Africa/Lagos", workingHours: [],
  departmentContacts: [
    { label: "Partnerships", email: "partners@pazelgreen.com", description: "Explore partnership and collaboration opportunities." },
    { label: "PAGEX Inquiry", email: "pagex@pazelgreen.com", description: "Want to learn more about Pazelgreen's flagship platform? Request a product conversation." },
  ],
  socialLinks: [
    { platform: "facebook", label: "Facebook", url: "#" }, { platform: "x", label: "Twitter/X", url: "#" },
    { platform: "linkedin", label: "LinkedIn", url: "#" }, { platform: "instagram", label: "Instagram", url: "#" },
  ],
} satisfies Partial<CompanySetting>;

export const getCompanySettings = cache(async () => {
  // Per-request reads avoid stale contact data and keep unpublished edits private.
  await connection();
  const payload = await getPayload({ config });
  const value = await payload.findGlobal({ slug: "company-settings", draft: false, overrideAccess: false, depth: 0 });
  return value._status === "published" ? value : existingCompany;
});

export function formatWorkingHours(rows: CompanySetting["workingHours"]) {
  return (rows ?? []).map(row => `${row.day[0].toUpperCase()}${row.day.slice(1)}: ${row.closed ? "Closed" : `${row.opens}–${row.closes}`}`);
}
