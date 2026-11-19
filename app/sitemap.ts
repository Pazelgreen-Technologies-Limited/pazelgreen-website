import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { staticPages } from "@/cms/page-seo";
import { openJobsWhere } from "@/cms/career-rules";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Metadata routes otherwise cache by default. Deadlines/publication need no rebuild.
  await connection();
  const payload = await getPayload({ config });
  const [posts, jobs, legal] = await Promise.all([
    payload.find({ collection: "posts", draft: false, overrideAccess: false, depth: 0, pagination: false, limit: 0, select: { slug: true } }),
    payload.find({ collection: "jobs", where: openJobsWhere(), draft: false, overrideAccess: false, depth: 0, pagination: false, limit: 0, select: { slug: true } }),
    payload.find({ collection: "legal-pages", draft: false, overrideAccess: false, depth: 0, pagination: false, limit: 0, select: { identity: true } }),
  ]);
  const paths = [
    ...Object.values(staticPages).map(page => page.path),
    ...posts.docs.map(post => `/blog/${post.slug}`),
    ...jobs.docs.map(job => `/join-us/careers/${job.slug}`),
    ...legal.docs.map(page => `/${page.identity}`),
  ];
  // Do not expose editorial timestamps or claim a draft save changed the public page.
  return paths.map(path => ({ url: new URL(path, payload.config.serverURL).toString() }));
}
