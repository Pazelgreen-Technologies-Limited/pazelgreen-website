import Link from "next/link";
import ArticleCard from "@/app/blog/_components/ArticleCard";
import type { Post } from "@/lib/blog-data";

interface BlogSidebarProps {
  latestPosts: Post[];
  categories: string[];
  tags: string[];
}

export default function BlogSidebar({
  latestPosts,
  categories,
  tags,
}: BlogSidebarProps) {
  return (
    <aside className="flex flex-col gap-8">
      {/* Latest Posts */}
      <div>
        <h3 className="mb-4 text-base font-bold text-gray-900">Latest Post</h3>
        <div className="flex flex-col gap-5">
          {latestPosts.slice(0, 4).map((post) => (
            <ArticleCard key={post.id} post={post} variant="compact" />
          ))}
        </div>

        {/* See All link */}
        <Link
          href="/blog"
          className="mt-4 inline-flex items-center gap-1 rounded-full bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
        >
          See All
        </Link>
      </div>

      {/* Categories */}
      <div>
        <h3 className="mb-4 text-base font-bold text-gray-900">Categories</h3>
        <ul className="space-y-2">
          {categories
            .filter((c) => c !== "All")
            .map((cat) => (
              <li key={cat}>
                <Link
                  href={`/blog?category=${cat}`}
                  className="text-sm text-gray-600 hover:text-green-600"
                >
                  {cat}
                </Link>
              </li>
            ))}
        </ul>
      </div>

      {/* Tags */}
      <div>
        <h3 className="mb-4 text-base font-bold text-gray-900">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${tag}`}
              className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:border-green-400 hover:text-green-600 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
