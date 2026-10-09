import { SITE_CONFIG } from "@/lib/site-config";

export const contactDetails = {
  ...SITE_CONFIG.contact,
  operatingHours: "Mon–Fri, 9:00 AM – 5:00 PM WAT",
} as const;
