import Image from "next/image";
import Link from "next/link";
import { Clock, MessageCircle } from "lucide-react";
import type { Post } from "@/lib/blog-data";

interface ArticleCardProps {
  post: Post;
  // "default" = full card used in grid
  // "compact" = small horizontal card used in sidebar
  variant?: "default" | "compact";
}

// Helper to format ISO date string to readable format
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ArticleCard({
  post,
  variant = "default",
}: ArticleCardProps) {
  // ── Compact variant: used in sidebar "Latest Posts" ──
  if (variant === "compact") {
    return (
      <Link href={`/blog/${post.slug}`} className="flex gap-3 group">
        {/* Thumbnail */}
        <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        {/* Text */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{post.author.name}</span>
            <span>·</span>
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          <p className="mt-1 text-sm font-medium text-gray-900 leading-snug group-hover:text-green-600 line-clamp-2">
            {post.title}
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
            <MessageCircle size={12} /> {post.commentCount} Comments
            <Clock size={12} /> {post.readTime} minutes
          </div>
        </div>
      </Link>
    );
  }

  // ── Default variant: full card used in article grid ──
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Cover image */}
      <div className="relative h-48 w-full overflow-hidden">
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

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>{post.author.name}</span>
          <span>·</span>
          <span>{formatDate(post.publishedAt)}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {post.readTime} min
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-2 text-base font-semibold text-gray-900 group-hover:text-green-600 line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="mt-2 text-sm text-gray-600 line-clamp-3 flex-1">
          {post.excerpt}
        </p>

        {/* Comment count */}
        <div className="mt-4 flex items-center gap-1 text-xs text-gray-400">
          <MessageCircle size={12} />
          {post.commentCount} Comments
        </div>
      </div>
    </Link>
  );
}
