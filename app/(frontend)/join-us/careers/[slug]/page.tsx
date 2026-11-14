import type { Metadata } from "next";
import { getPublishedJob } from "@/lib/careers";
import { JobView } from "../_components/JobView";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getPublishedJob((await params).slug);
  return { title: job.seo?.title?.trim() || `${job.title} | Pazelgreen careers`, description: job.seo?.description?.trim() || job.summary };
}
export default async function JobPage({ params }: Props) {
  return <JobView job={await getPublishedJob((await params).slug)} />;
}
