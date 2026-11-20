import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { isStaff } from "@/cms/access";
import { canAccessSection } from "@/cms/permissions";
import { getArticleMedia } from "@/lib/blog";
import { ArticleView } from "../../[slug]/_components/ArticleView";

export const metadata: Metadata = { title: "Draft preview | Pazelgreen", robots: { index: false, follow: false }, referrer: "no-referrer" };

export default async function BlogPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) notFound();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  if (!isStaff(user)) redirect(`/admin/login?redirect=${encodeURIComponent(`/blog/preview/${id}`)}`);
  if (!canAccessSection(user, "blog")) notFound();
  const post = (await payload.find({ collection: "posts", where: { id: { equals: Number(id) } }, draft: true, overrideAccess: false, user, depth: 1, limit: 1 })).docs[0];
  if (!post) notFound();
  return <ArticleView post={post} media={await getArticleMedia(post, user)} preview />;
}
