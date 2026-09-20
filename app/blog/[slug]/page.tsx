import { notFound } from "next/navigation";
import BlogDetailHero from "./_components/BlogDetailHero";
import ArticleContent from "./_components/ArticleContent";
import BlogSidebar from "./_components/BlogSidebar";
import CommentSection from "./_components/CommentSection";
import {
  MOCK_POSTS,
  MOCK_COMMENTS,
  MOCK_CATEGORIES,
  MOCK_TAGS,
} from "@/lib/blog-data";

interface BlogDetailPageProps {
  params: { slug: string };
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  // BACKEND: replace with → GET /api/posts/:slug
  const post = MOCK_POSTS.find((p) => p.slug === params.slug);

  // Show 404 if post not found
  if (!post) notFound();

  // BACKEND: replace with → GET /api/posts (for sidebar latest posts)
  const allPosts = MOCK_POSTS;

  // BACKEND: replace with → GET /api/posts/:slug/comments
  const comments = MOCK_COMMENTS;

  // Find previous and next posts for navigation
  const currentIndex = allPosts.findIndex((p) => p.slug === params.slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <main>
      {/* Full-width hero with cover image */}
      <BlogDetailHero post={post} />

      {/* Two-column layout: article content + sidebar */}
      <div className="bg-white px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">
            {/* Left: article body + comments */}
            <div>
              <ArticleContent
                post={post}
                prevPost={prevPost}
                nextPost={nextPost}
              />
              <CommentSection comments={comments} slug={params.slug} />
            </div>

            {/* Right: sidebar — stacks below content on mobile */}
            <BlogSidebar
              latestPosts={allPosts}
              categories={MOCK_CATEGORIES}
              tags={MOCK_TAGS}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
