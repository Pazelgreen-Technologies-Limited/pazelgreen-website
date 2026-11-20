import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getServerEnvironment } from "@/env";

export default async function robots(): Promise<MetadataRoute.Robots> {
  await connection();
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/blog/preview/", "/join-us/careers/preview/", "/legal/preview/"] },
    sitemap: new URL("/sitemap.xml", getServerEnvironment().serverURL).toString(),
  };
}
