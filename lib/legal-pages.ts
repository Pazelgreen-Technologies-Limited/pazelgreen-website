import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPayload } from "payload";
import config from "@payload-config";

export type LegalIdentity = "privacy-policy" | "terms-of-service";
export const getPublishedLegalPage = cache(async (identity: LegalIdentity) => {
  await connection();
  const payload = await getPayload({ config });
  const page = (await payload.find({ collection: "legal-pages", where: { identity: { equals: identity } }, draft: false, overrideAccess: false, depth: 0, limit: 1 })).docs[0];
  if (!page) notFound();
  return page;
});

export async function legalMetadata(identity: LegalIdentity): Promise<Metadata> {
  const page = await getPublishedLegalPage(identity);
  return { title: page.seo?.title?.trim() || `${page.title} | Pazelgreen`,
    description: page.seo?.description?.trim() || (identity === "privacy-policy" ? "Read Pazelgreen's privacy policy." : "Read Pazelgreen's terms of service."),
    alternates: { canonical: new URL(`/${identity}`, (await config).serverURL).toString() } };
}
