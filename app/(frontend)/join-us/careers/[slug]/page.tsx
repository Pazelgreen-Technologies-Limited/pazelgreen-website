import type { Metadata } from "next";
import { getPublishedJob } from "@/lib/careers";
import { JobView } from "../_components/JobView";
import { jobIsOpen } from "@/cms/career-rules";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getPublishedJob((await params).slug);
  return { title: job.seo?.title?.trim() || `${job.title} | Pazelgreen careers`, description: job.seo?.description?.trim() || job.summary,
    robots: jobIsOpen(job) ? { index: true, follow: true } : { index: false, follow: true } };
}
export default async function JobPage({ params }: Props) {
  return <JobView job={await getPublishedJob((await params).slug)} />;
}
