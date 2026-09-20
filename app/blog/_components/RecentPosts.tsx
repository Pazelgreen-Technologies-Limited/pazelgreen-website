"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import ArticleCard from "./ArticleCard";
import type { Post } from "@/lib/blog-data";

interface RecentPostsProps {
  posts: Post[];
  categories: string[];
}

// How many posts to show per page
const POSTS_PER_PAGE = 6;

export default function RecentPosts({ posts, categories }: RecentPostsProps) {
  const [activeCategory, setActiveCategory] = useState("All Articles");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter by category first
  const byCategory =
    activeCategory === "All Articles"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  // Then filter by search query (title or excerpt)
  const filtered = searchQuery.trim()
    ? byCategory.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : byCategory;

  // Pagination calculations
  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + POSTS_PER_PAGE);

  // Reset to page 1 when filter or search changes
  function handleCategoryChange(cat: string) {
    setActiveCategory(cat);
    setCurrentPage(1);
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }

  return (
    <section className="bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* ── Filter row: category tabs + search ── */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors
                  ${
                    activeCategory === cat
                      ? "bg-green-500 text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:text-green-600"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search input */}
          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 w-full sm:w-56">
            <Search size={14} className="shrink-0 text-gray-400" />
            <input
              type="text"
              placeholder="Search Articles..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* ── Section heading ── */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Recent Posts</h2>
          <a
            href="/blog"
            className="text-sm font-medium text-green-600 hover:underline"
          >
            See All Articles
          </a>
        </div>

        {/* ── Article grid ── */}
        {paginated.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {paginated.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-sm text-gray-500">
            No articles found.
          </p>
        )}

        {/* ── Numbered pagination ── */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-9 w-9 rounded-full text-sm font-medium transition-colors
                  ${
                    currentPage === page
                      ? "bg-green-500 text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-600"
                  }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
