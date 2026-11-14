import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { isStaff } from "@/cms/access";
import { JobView } from "../../_components/JobView";

export const metadata: Metadata = { title: "Job draft preview | Pazelgreen", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default async function JobPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) notFound();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  if (!isStaff(user)) redirect(`/admin/login?redirect=${encodeURIComponent(`/join-us/careers/preview/${id}`)}`);
  const job = (await payload.find({ collection: "jobs", where: { id: { equals: Number(id) } }, draft: true, overrideAccess: false, user, depth: 1, limit: 1 })).docs[0];
  if (!job) notFound();
  return <JobView job={job} preview />;
}
