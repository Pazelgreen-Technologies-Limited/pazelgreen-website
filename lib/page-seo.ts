import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import type { Metadata } from "next";
import { getPayload } from "payload";
import config from "@payload-config";
import type { StaticPage } from "@/cms/page-seo";

const getPublishedSEO = cache(async () => {
  await connection();
  const payload = await getPayload({ config });
  return payload.findGlobal({ slug: "page-seo", draft: false, overrideAccess: false, depth: 0 });
});

export async function pageMetadata(page: StaticPage, defaults?: { title: string; description: string }): Promise<Metadata> {
  const seo = await getPublishedSEO();
  const fields = seo._status === "published" ? seo[page] : undefined;
  return {
    title: fields?.title?.trim() || defaults?.title || "Pazelgreen Technologies",
    description: fields?.description?.trim() || defaults?.description || "Innovating the future of sustainable agriculture",
  };
}
