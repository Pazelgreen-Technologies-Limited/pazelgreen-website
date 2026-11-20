import type { GlobalConfig } from "payload";
import { withGlobalReview } from "./global-review";

export const validPublicURL = (value: unknown) => {
  if (!value) return "A public URL is required.";
  try { return ["http:", "https:"].includes(new URL(String(value)).protocol) || "Use an HTTP or HTTPS URL."; }
  catch { return "Use a valid HTTP or HTTPS URL."; }
};

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export const CompanySettings: GlobalConfig = withGlobalReview({
  slug: "company-settings",
  label: "Company settings",
  admin: { group: "Website", description: "Public contact information. Save a draft, submit for review, then publish as an administrator. Never add private notification recipients here." },
  fields: [
    { name: "email", type: "email", label: "Primary email" },
    { name: "phone", type: "text", maxLength: 50 },
    { name: "address", type: "textarea", maxLength: 500 },
    { name: "departmentContacts", type: "array", fields: [
      { name: "label", type: "text", required: true, maxLength: 100 },
      { name: "email", type: "email", required: true },
      { name: "description", type: "text", maxLength: 250 },
    ] },
    { name: "timezone", type: "text", defaultValue: "Africa/Lagos", required: true, validate: (value: unknown) => {
      try { new Intl.DateTimeFormat("en", { timeZone: String(value) }); return true; }
      catch { return "Use an IANA timezone, for example Africa/Lagos."; }
    } },
    { name: "workingHours", type: "array", validate: (value: unknown) => {
      if (!Array.isArray(value)) return true;
      const selected = new Set<string>();
      for (const row of value as { day?: string; closed?: boolean; opens?: string; closes?: string }[]) {
        if (!row.day || selected.has(row.day)) return "Choose each day at most once.";
        selected.add(row.day);
        if (!row.closed && (!timePattern.test(row.opens ?? "") || !timePattern.test(row.closes ?? "") || row.opens! >= row.closes!)) return "Open days need HH:mm opening and closing times, with closing after opening.";
      }
      return true;
    }, fields: [
      { name: "day", type: "select", required: true, options: days },
      { name: "closed", type: "checkbox", defaultValue: false },
      { name: "opens", type: "text", admin: { description: "24-hour HH:mm in the configured timezone." } },
      { name: "closes", type: "text" },
    ] },
    { name: "socialLinks", type: "array", fields: [
      { name: "platform", type: "select", required: true, options: ["facebook", "x", "linkedin", "instagram", "youtube", "other"] },
      { name: "label", type: "text", required: true, maxLength: 100 },
      { name: "url", type: "text", required: true, validate: validPublicURL },
    ] },
  ],
});
