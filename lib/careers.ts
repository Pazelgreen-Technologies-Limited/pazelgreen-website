import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { openJobsWhere } from "@/cms/career-rules";
import { blogSlugPattern } from "@/cms/blog-content";

export const getOpenJobs = cache(async (page = 1, limit = 12) => {
  await connection();
  const payload = await getPayload({ config });
  const jobs = await payload.find({ collection: "jobs", where: openJobsWhere(), page, limit, sort: ["-referenceYear", "-referenceSequence", "-id"], draft: false, overrideAccess: false, depth: 1 });
  if (page > Math.max(1, jobs.totalPages)) notFound();
  return jobs;
});

export const getPublishedJob = cache(async (slug: string) => {
  await connection();
  if (slug.length > 120 || !blogSlugPattern.test(slug)) notFound();
  const payload = await getPayload({ config });
  const job = (await payload.find({ collection: "jobs", where: { slug: { equals: slug } }, limit: 1, draft: false, overrideAccess: false, depth: 1 })).docs[0];
  if (!job) notFound();
  return job;
});
