"use client";

import { useState } from "react";
import ArticleCard from "./ArticleCard";
import type { Post } from "@/lib/blog-data";

interface ArticleGridProps {
  posts: Post[];
  categories: string[];
}

export default function ArticleGrid({ posts, categories }: ArticleGridProps) {
  // Track the currently selected category filter
  const [activeCategory, setActiveCategory] = useState("All");

  // Filter posts by selected category
  const filtered =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  return (
    <section className="bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Category filter tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
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

        {/* Article grid — 3 columns on desktop, 1 on mobile */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {filtered.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-sm text-gray-500">
            No articles found in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}
