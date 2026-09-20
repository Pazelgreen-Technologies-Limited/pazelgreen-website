import Link from "next/link";
import { ThumbsUp, MessageCircle, Bookmark, Share2 } from "lucide-react";
import type { Post } from "@/lib/blog-data";

interface ArticleContentProps {
  post: Post;
  prevPost?: Pick<Post, "slug" | "title"> | null;
  nextPost?: Pick<Post, "slug" | "title"> | null;
}

export default function ArticleContent({
  post,
  prevPost,
  nextPost,
}: ArticleContentProps) {
  return (
    <article className="min-w-0">
      {/* Article heading */}
      <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
        {post.title}
      </h2>

      {/* Intro blockquote — first paragraph styled as a pull quote */}
      <blockquote className="my-6 border-l-4 border-green-500 pl-4 text-sm italic text-gray-600">
        {post.excerpt}
      </blockquote>

      {/*
        Article body — rendered as HTML from the content field.
        The prose styles below handle headings, paragraphs and lists.
        Install @tailwindcss/typography and add `prose` class if preferred.
      */}
      <div
        className="text-sm leading-7 text-gray-700 space-y-4
          [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-gray-900
          [&_p]:text-gray-600"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Stats highlight cards */}
      <div className="my-8 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-green-500 p-5 text-white">
          <p className="text-3xl font-black">up to 40%</p>
          <p className="mt-1 text-sm text-green-100">
            less water used per season
          </p>
        </div>
        <div className="rounded-xl bg-green-50 p-5">
          <p className="text-3xl font-black text-gray-900">15–25%</p>
          <p className="mt-1 text-sm text-gray-600">
            average yield improvement
          </p>
        </div>
      </div>

      {/* Previous / Next navigation */}
      <div className="my-8 grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-6">
        {prevPost ? (
          <Link href={`/blog/${prevPost.slug}`} className="group">
            <p className="text-xs text-gray-400">Previous</p>
            <p className="mt-1 text-sm font-medium text-gray-700 group-hover:text-green-600 line-clamp-2">
              {prevPost.title}
            </p>
          </Link>
        ) : (
          <div />
        )}
        {nextPost ? (
          <Link href={`/blog/${nextPost.slug}`} className="group text-right">
            <p className="text-xs text-gray-400">Next</p>
            <p className="mt-1 text-sm font-medium text-gray-700 group-hover:text-green-600 line-clamp-2">
              {nextPost.title}
            </p>
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Likes / Comments / Saves / Share bar */}
      <div className="flex flex-wrap items-center gap-4">
        <button className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-green-400 hover:text-green-600 transition-colors">
          <ThumbsUp size={15} /> {post.likeCount} Likes
        </button>
        <button className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-green-400 hover:text-green-600 transition-colors">
          <MessageCircle size={15} /> {post.commentCount} Comments
        </button>
        <button className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-green-400 hover:text-green-600 transition-colors">
          <Bookmark size={15} /> {post.saveCount} Saves
        </button>
        <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
          <Share2 size={15} /> Share
        </div>
      </div>

      {/* Tags */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Tags:</span>
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:border-green-400 hover:text-green-600 cursor-pointer transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
