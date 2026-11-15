import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { isStaff } from "@/cms/access";
import { LegalDocument } from "@/components/LegalDocument";

export const metadata: Metadata = { title: "Legal draft preview | Pazelgreen", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default async function LegalPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) notFound();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  if (!isStaff(user)) redirect(`/admin/login?redirect=${encodeURIComponent(`/legal/preview/${id}`)}`);
  const page = (await payload.find({ collection: "legal-pages", where: { id: { equals: Number(id) } }, draft: true, overrideAccess: false, user, depth: 0, limit: 1 })).docs[0];
  if (!page) notFound();
  return <LegalDocument page={page} preview />;
}
