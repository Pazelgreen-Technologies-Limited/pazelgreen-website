import BlogHero from "./_components/BlogHero";
import FeaturedArticle from "./_components/FeaturedArticle";
import RecentPosts from "./_components/RecentPosts";
import StayUpdatedBanner from "./_components/StayUpdatedBanner";
import TrendingArticles from "./_components/TrendingArticles";
import GetInvolvedSection from "../_components/GetInvolvedSection";
import { MOCK_POSTS, MOCK_CATEGORIES } from "@/lib/blog-data";

export default function BlogPage() {
  // BACKEND: replace MOCK_POSTS with → GET /api/posts
  const posts = MOCK_POSTS;

  // BACKEND: replace MOCK_CATEGORIES with → GET /api/categories
  // Note: "All Articles" is the default tab label on this page
  const categories = [
    "All Articles",
    ...MOCK_CATEGORIES.filter((c) => c !== "All"),
  ];

  // First post is the featured article
  const featuredPost = posts[0];

  // Remaining posts go into the recent posts grid
  const recentPosts = posts.slice(1);

  return (
    <main>
      <BlogHero />
      <FeaturedArticle post={featuredPost} />
      <RecentPosts posts={recentPosts} categories={categories} />
      <StayUpdatedBanner />
      <TrendingArticles posts={posts} />
      <GetInvolvedSection />
    </main>
  );
}
