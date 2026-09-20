import Image from "next/image";
import Link from "next/link";
import { Clock, MessageCircle, User } from "lucide-react";
import type { Post } from "@/lib/blog-data";

interface FeaturedArticleProps {
  post: Post;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function FeaturedArticle({ post }: FeaturedArticleProps) {
  return (
    <section className="bg-white px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/blog/${post.slug}`}
          className="group grid grid-cols-1 gap-6 overflow-hidden rounded-2xl border border-gray-100 shadow-sm md:grid-cols-2"
        >
          {/* Left: cover image */}
          <div className="relative h-64 w-full overflow-hidden md:h-100">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>

          {/* Right: content */}
          <div className="flex flex-col justify-center p-6 md:p-8">
            {/* Badge */}
            <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-500">
              ★ FEATURED ARTICLE
            </span>

            <h2 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors md:text-2xl">
              {post.title}
            </h2>

            <p className="mt-3 text-sm text-gray-600 line-clamp-4">
              {post.excerpt}
            </p>

            {/* Meta row */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <User size={12} /> {post.author.name}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={12} /> {post.commentCount} Comments
              </span>
              <span>{formatDate(post.publishedAt)}</span>
              <span className="flex items-center gap-1">
                <Clock size={12} /> {post.readTime} minutes
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
