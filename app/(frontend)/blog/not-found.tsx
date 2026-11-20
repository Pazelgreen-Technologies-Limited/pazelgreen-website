import Link from "next/link";

export default function BlogNotFound() {
  return <main className="bg-green-950 px-6 pb-24 pt-44 text-white"><div className="mx-auto max-w-3xl">
    <h1 className="text-4xl font-extrabold">Article or page not found</h1>
    <p className="mt-5 text-lg text-green-100">This link may have changed, or the article is not currently available.</p>
    <Link className="mt-8 inline-block rounded-full bg-white px-6 py-3 font-semibold text-green-950 focus-visible:outline-2 focus-visible:outline-offset-4" href="/blog">Browse all articles</Link>
  </div></main>;
}
