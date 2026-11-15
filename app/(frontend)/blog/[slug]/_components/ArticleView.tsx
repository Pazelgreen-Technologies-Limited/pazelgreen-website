import Image from "next/image";
import Link from "next/link";
import type { Media, Post } from "@/payload-types";
import { relationID } from "@/cms/blog-content";
import { blogListingURL } from "@/lib/blog-query";
import { RichTextBody } from "@/components/RichTextBody";

export function ArticleView({ post, media, preview = false }: { post: Post; media: Media[]; preview?: boolean }) {
  const cover = media.find(image => image.id === relationID(post.coverImage));
  return <main>
    <header className="bg-green-950 px-6 pb-14 pt-36 text-white md:pb-20 md:pt-44">
      <div className="mx-auto max-w-3xl">
        {preview && <aside className="mb-7 rounded-xl border border-amber-200/50 bg-amber-50 p-4 text-sm text-amber-950">Draft preview. This version is visible only to signed-in editors. <Link className="font-semibold underline" href={`/admin/collections/posts/${post.id}`}>Return to the editor</Link></aside>}
        <Link className="text-sm text-green-100 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4" href="/blog">All articles</Link>
        {!!post.categories?.length && <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold text-green-100">{post.categories.map(category => typeof category === "object" ? <Link key={category.id} className="max-w-full break-words underline underline-offset-4" href={blogListingURL(1, category.slug)}>{category.name}</Link> : null)}</div>}
        <h1 className="mt-6 break-words text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">{post.title || "Untitled draft"}</h1>
        <p className="mt-6 break-words text-lg leading-relaxed text-green-50">{post.excerpt}</p>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-green-100">
          {post.authorName && <span className="max-w-full break-words">By {post.authorName}</span>}
          {post.publicationDate && <time dateTime={post.publicationDate}>{new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Lagos" }).format(new Date(post.publicationDate))}</time>}
        </div>
      </div>
    </header>
    <article aria-label={post.title || "Article preview"} className="px-6 pb-16 pt-10 md:pb-24 md:pt-14">
      {cover?.url && <figure className="mx-auto mb-12 max-w-5xl">
        <Image src={cover.url} alt={cover.alt} width={cover.width || 1400} height={cover.height || 900} sizes="(min-width: 1024px) 1024px, 100vw" className="max-h-[36rem] w-full rounded-2xl object-cover" priority unoptimized />
        {(cover.caption || cover.attribution) && <figcaption className="mt-3 text-sm text-gray-500">{[cover.caption, cover.attribution].filter(Boolean).join(" — ")}</figcaption>}
      </figure>}
      <div className="mx-auto max-w-3xl"><RichTextBody body={post.body} media={media} preview={preview} /></div>
    </article>
  </main>;
}
