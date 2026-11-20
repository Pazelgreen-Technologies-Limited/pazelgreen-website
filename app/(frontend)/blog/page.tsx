import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/page-seo";
import { getBlogListing } from "@/lib/blog";
import { blogListingURL, parseBlogSearch, type BlogSearch } from "@/lib/blog-query";
import { PostCard } from "./_components/PostCard";

export const generateMetadata = () => pageMetadata("blog", { title: "News & insights | Pazelgreen", description: "Updates and perspectives on agriculture, technology and the systems connecting them." });

export default async function BlogPage({ searchParams }: { searchParams: Promise<BlogSearch> }) {
  const query = parseBlogSearch(await searchParams);
  if (!query) notFound();
  const { posts, categories, category } = await getBlogListing(query.page, query.category);
  return <main>
    <section className="relative overflow-hidden bg-green-950 px-6 pb-16 pt-40 text-white md:pb-20 md:pt-44">
      <Image src="/about-hero-bg.jpg" alt="" fill priority sizes="100vw" className="object-cover opacity-20" />
      <div className="relative mx-auto max-w-5xl">
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">News &amp; insights</h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-green-50 md:text-lg">Updates and perspectives on agriculture, technology and the systems connecting them.</p>
      </div>
    </section>
    <section className="mx-auto max-w-5xl px-6 py-10 md:py-14" aria-label="Blog articles">
      <nav aria-label="Filter articles by category" className="flex flex-wrap gap-2 border-b border-green-950/15 pb-6">
        <Link href="/blog" aria-current={!category ? "page" : undefined} className={`max-w-full break-words rounded-full px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 ${!category ? "bg-green-950 text-white" : "bg-green-50 text-green-900 hover:bg-green-100"}`}>All articles</Link>
        {categories.map(item => <Link href={blogListingURL(1, item.slug)} key={item.id} aria-current={item.id === category?.id ? "page" : undefined} className={`max-w-full break-words rounded-full px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 ${item.id === category?.id ? "bg-green-950 text-white" : "bg-green-50 text-green-900 hover:bg-green-100"}`}>{item.name}</Link>)}
      </nav>
      {category?.description && <p className="mt-6 max-w-2xl leading-relaxed text-gray-600">{category.description}</p>}
      {posts.docs.length ? <>
        <p className="mt-7 text-sm text-gray-600">{posts.totalDocs} {posts.totalDocs === 1 ? "article" : "articles"}{category ? ` in ${category.name}` : ""}</p>
        <div>{posts.docs.map(post => <PostCard key={post.id} post={post} />)}</div>
        {posts.totalPages > 1 && <nav aria-label="Blog pagination" className="mt-10 flex flex-wrap items-center justify-between gap-4 text-sm font-semibold text-green-900">
          {posts.hasPrevPage ? <Link className="rounded-full border border-green-950/20 px-5 py-3 hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-offset-4" rel="prev" href={blogListingURL(query.page - 1, query.category)}>Previous page</Link> : <span />}
          <p aria-live="polite">Page {query.page} of {posts.totalPages}</p>
          {posts.hasNextPage ? <Link className="rounded-full border border-green-950/20 px-5 py-3 hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-offset-4" rel="next" href={blogListingURL(query.page + 1, query.category)}>Next page</Link> : <span />}
        </nav>}
      </> : <div className="py-20">
        <h2 className="text-2xl font-bold text-green-950">{category ? "No articles in this category yet" : "Our first stories are on the way"}</h2>
        <p className="mt-3 max-w-xl leading-relaxed text-gray-600">{category ? "Explore the other articles from Pazelgreen while we prepare more updates." : "Check back for updates from the Pazelgreen team."}</p>
        {category && <Link className="mt-6 inline-block font-semibold text-green-800 underline underline-offset-4" href="/blog">View all articles</Link>}
      </div>}
    </section>
  </main>;
}
