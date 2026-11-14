import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { getPayload, type PayloadRequest, type Where } from "payload";
import config from "@payload-config";
import type { Post } from "@/payload-types";
import { blogSlugPattern, inspectArticleBody, relationID } from "@/cms/blog-content";
import { blogPageSize } from "./blog-query";

export const getBlogCategories = cache(async () => {
  await connection();
  const payload = await getPayload({ config });
  return (await payload.find({ collection: "categories", pagination: false, sort: "name", draft: false, overrideAccess: false, depth: 0 })).docs;
});

export async function getBlogListing(page: number, categorySlug?: string) {
  await connection();
  const payload = await getPayload({ config });
  const categories = await getBlogCategories();
  const category = categorySlug ? categories.find(item => item.slug === categorySlug) : undefined;
  if (categorySlug && !category) notFound();
  const where: Where = category ? { categories: { contains: category.id } } : {};
  const posts = await payload.find({ collection: "posts", page, limit: blogPageSize, sort: ["-publicationDate", "-id"], where,
    draft: false, overrideAccess: false, depth: 1,
    select: { title: true, slug: true, excerpt: true, authorName: true, publicationDate: true, coverImage: true, categories: true },
  });
  if (page > Math.max(posts.totalPages, 1)) notFound();
  return { posts, categories, category };
}

export const getPublishedPost = cache(async (slug: string) => {
  await connection();
  if (slug.length > 120 || !blogSlugPattern.test(slug)) notFound();
  const payload = await getPayload({ config });
  const post = (await payload.find({ collection: "posts", where: { slug: { equals: slug } }, limit: 1, draft: false, overrideAccess: false, depth: 1 })).docs[0];
  if (!post) notFound();
  return post;
});

export async function getArticleMedia(post: Post, user?: PayloadRequest["user"]) {
  const ids = new Set(inspectArticleBody(post.body).mediaIDs);
  const coverID = relationID(post.coverImage);
  if (coverID) ids.add(coverID);
  if (!ids.size) return [];
  const payload = await getPayload({ config });
  // Resolve IDs through Payload; never render arbitrary URLs embedded in node data.
  return (await payload.find({ collection: "media", where: { id: { in: [...ids] } }, limit: ids.size,
    draft: Boolean(user), overrideAccess: false, user, depth: 0 })).docs;
}
