import type { Metadata } from "next";
import { getPublishedPost, getArticleMedia } from "@/lib/blog";
import { ArticleView } from "./_components/ArticleView";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPublishedPost((await params).slug);
  return { title: post.seo?.title?.trim() || `${post.title} | Pazelgreen`, description: post.seo?.description?.trim() || post.excerpt,
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.publicationDate, authors: [post.authorName] } };
}

export default async function BlogArticlePage({ params }: Props) {
  const post = await getPublishedPost((await params).slug);
  return <ArticleView post={post} media={await getArticleMedia(post)} />;
}
