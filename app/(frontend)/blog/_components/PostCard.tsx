import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/payload-types";
import { blogListingURL } from "@/lib/blog-query";

type Summary = Pick<Post, "id" | "title" | "slug" | "excerpt" | "authorName" | "publicationDate" | "coverImage" | "categories">;

export function PostCard({ post }: { post: Summary }) {
  const image = typeof post.coverImage === "object" && post.coverImage?._status === "published" ? post.coverImage : null;
  return <article className={`grid gap-6 border-b border-green-950/15 py-9 ${image?.url ? "md:grid-cols-[15rem_minmax(0,1fr)]" : ""}`}>
    {image?.url && <Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true" className="relative block aspect-[4/3] overflow-hidden rounded-xl bg-green-50">
      <Image src={image.url} alt={image.alt} fill sizes="(min-width: 768px) 240px, 100vw" className="object-cover" unoptimized />
    </Link>}
    <div className="min-w-0 self-center">
      {!!post.categories?.length && <div className="mb-3 flex flex-wrap gap-3 text-sm font-semibold text-green-800">
        {post.categories.map(category => typeof category === "object" && category._status === "published" ? <Link className="max-w-full break-words underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4" key={category.id} href={blogListingURL(1, category.slug)}>{category.name}</Link> : null)}
      </div>}
      <h2 className="max-w-3xl break-words text-2xl font-extrabold leading-tight text-green-950 md:text-3xl"><Link className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4" href={`/blog/${post.slug}`}>{post.title}</Link></h2>
      <p className="mt-3 max-w-2xl break-words text-base leading-relaxed text-gray-600">{post.excerpt}</p>
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-600">
        <span className="max-w-full break-words">By {post.authorName}</span>
        <time dateTime={post.publicationDate}>{new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Lagos" }).format(new Date(post.publicationDate))}</time>
      </div>
    </div>
  </article>;
}
