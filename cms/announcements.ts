import { APIError } from "payload";
import { withReview } from "./workflow";
import { canAccessSection } from "./permissions";

export function safeAnnouncementURL(value: unknown) {
  if (typeof value !== "string" || /[\u0000-\u0020\\]/.test(value)) return false;
  if (value.startsWith("/")) return !value.startsWith("//");
  try { return ["https:", "http:"].includes(new URL(value).protocol); } catch { return false; }
}

export const Announcements = withReview({
  slug: "announcements", admin: { useAsTitle: "title", group: "Website", defaultColumns: ["title", "enabled", "startsAt", "endsAt", "priority", "reviewState"], description: "One notice appears above navigation. Dates store exact UTC instants; the admin date picker displays your browser timezone. Use explicit offsets through the API. Highest priority wins, then newest publication, then lowest ID." },
  fields: [
    { name: "title", label: "Internal title", type: "text", required: true, maxLength: 120, access: { read: ({ req }) => canAccessSection(req.user, "announcements") } },
    { name: "message", type: "textarea", required: true, maxLength: 300 },
    { name: "linkLabel", type: "text", maxLength: 80 },
    { name: "linkURL", type: "text", maxLength: 1000, validate: (value: unknown) => !value || safeAnnouncementURL(value) || "Use an HTTP(S) or site-relative URL." },
    { name: "enabled", type: "checkbox", defaultValue: true, required: true },
    { name: "scheduleTimezone", type: "ui", admin: { components: { Field: "/cms/components/ScheduleTimezone#ScheduleTimezone" } } },
    { name: "startsAt", type: "date", admin: { date: { pickerAppearance: "dayAndTime" } } },
    { name: "endsAt", type: "date", admin: { date: { pickerAppearance: "dayAndTime" } } },
    { name: "priority", type: "number", required: true, defaultValue: 0, min: -10000, max: 10000 },
  ], hooks: { beforeChange: [({ data, originalDoc, req }) => {
    const item = { ...originalDoc, ...data };
    if (item.linkURL && !safeAnnouncementURL(item.linkURL)) throw new APIError("Use an HTTP(S) or site-relative announcement URL.", 400);
    if (item.startsAt && item.endsAt && Date.parse(item.endsAt) <= Date.parse(item.startsAt)) throw new APIError("Announcement end must be after start.", 400);
    if (req.context.reviewPublishing) {
      if (!item.message?.trim() || !Number.isInteger(item.priority)) throw new APIError("Provide a message and whole-number priority before approval.", 400);
      if (Boolean(item.linkURL) !== Boolean(item.linkLabel?.trim())) throw new APIError("Provide both a link label and URL, or neither.", 400);
    }
    return data;
  }] },
});
