"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock, MessageCircle } from "lucide-react";
import type { Post } from "@/lib/blog-data";

interface TrendingArticlesProps {
  posts: Post[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function TrendingArticles({ posts }: TrendingArticlesProps) {
  // Ref to the scrollable container so the arrows can control it
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll left or right by one card width (~300px)
  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  }

  return (
    <section className="bg-white px-6 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <h2 className="mb-8 text-center text-xl font-bold text-green-600">
          Trending Articles
        </h2>

        {/* Carousel wrapper with arrow buttons */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-green-50 transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>

          {/*
            Scrollable container:
            - overflow-x-auto enables horizontal scroll
            - scroll-snap-type x mandatory makes each card snap into place
            - scrollbar-hide removes the scrollbar (add the plugin or use CSS)
            - On mobile: swipe naturally; on desktop: use the arrow buttons
          */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scroll-smooth pb-2
              [scroll-snap-type:x_mandatory]
              [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                // Each card snaps to start and has a fixed width
                className="group w-72 shrink-0 overflow-hidden rounded-2xl border border-gray-100 shadow-sm
                  [scroll-snap-align:start] hover:shadow-md transition-shadow"
              >
                {/* Cover image */}
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  {/* Category badge */}
                  <span className="absolute top-3 left-3 rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white">
                    {post.category}
                  </span>
                </div>

                {/* Card content */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-xs text-gray-500 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <MessageCircle size={11} /> {post.commentCount}
                    </span>
                    <span>{formatDate(post.publishedAt)}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {post.readTime} min
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-green-50 transition-colors"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
}
