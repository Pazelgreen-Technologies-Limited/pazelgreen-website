import Image from "next/image";
import { Clock, MessageCircle, User } from "lucide-react";
import type { Post } from "@/lib/blog-data";

interface BlogDetailHeroProps {
  post: Post;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogDetailHero({ post }: BlogDetailHeroProps) {
  return (
    <section className="relative h-[480px] w-full overflow-hidden">
      {/* Post cover image as hero background */}
      <Image
        src={post.coverImage}
        alt={post.title}
        fill
        priority
        className="object-cover"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Post title + meta overlaid at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold text-white md:text-4xl">
            {post.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-300">{post.excerpt}</p>

          {/* Meta row */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-300">
            <span className="flex items-center gap-1">
              <User size={12} /> By {post.author.name}
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
      </div>
    </section>
  );
}
