import Link from "next/link";
import { notFound } from "next/navigation";
import { getOpenJobs } from "@/lib/careers";
import { pageMetadata } from "@/lib/page-seo";
import { RefreshAt } from "@/components/RefreshAt";

export const generateMetadata = () => pageMetadata("careers", { title: "Careers | Pazelgreen", description: "Find your next opportunity to build a more sustainable food system with Pazelgreen." });

export default async function CareersPage({ searchParams }: { searchParams: Promise<{ page?: string | string[] }> }) {
  const raw = (await searchParams).page;
  if (raw !== undefined && (typeof raw !== "string" || !/^[1-9]\d{0,5}$/.test(raw))) notFound();
  const page = Number(raw ?? 1);
  const jobs = await getOpenJobs(page);
  return <main>
    <RefreshAt timestamps={jobs.docs.map(job => job.deadline)} />
    <section className="bg-green-950 px-6 pb-16 pt-40 text-white md:pt-44">
      <div className="mx-auto max-w-5xl">
        <Link href="/join-us" className="text-sm text-green-100 underline underline-offset-4">Join Pazelgreen</Link>
        <h1 className="mt-5 text-4xl font-extrabold md:text-6xl">Work with purpose</h1>
        <p className="mt-5 max-w-2xl leading-relaxed text-green-50">Help build a more sustainable food system. Explore our current opportunities and find where your skills can make a difference.</p>
      </div>
    </section>
    <section aria-label="Open positions" className="mx-auto max-w-5xl px-6 py-12">
      <h2 className="text-2xl font-bold text-green-950">Open positions</h2>
      {jobs.docs.length ? <>
        <p className="mt-3 text-sm text-gray-600">{jobs.totalDocs} {jobs.totalDocs === 1 ? "opportunity" : "opportunities"}</p>
        <div className="mt-6 divide-y divide-green-950/15">
          {jobs.docs.map(job => <article key={job.id} className="py-7">
            <p className="break-words text-xs font-semibold tracking-wide text-green-800">REF-ID: {job.reference}</p>
            <h3 className="mt-2 break-words text-xl font-bold text-green-950"><Link className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4" href={`/join-us/careers/${job.slug}`}>{job.title}</Link></h3>
            <p className="mt-2 text-sm capitalize text-gray-600">{job.location} · {job.arrangement}{typeof job.employmentType === "object" && job.employmentType ? ` · ${job.employmentType.name}` : ""}</p>
            <p className="mt-3 max-w-3xl break-words leading-relaxed text-gray-700">{job.summary}</p>
            <Link className="mt-4 inline-block text-sm font-bold text-green-800 underline underline-offset-4" href={`/join-us/careers/${job.slug}`}>View role<span className="sr-only">: {job.title}</span></Link>
          </article>)}
        </div>
        {jobs.totalPages > 1 && <nav aria-label="Careers pagination" className="mt-8 flex flex-wrap justify-between gap-4 font-semibold text-green-800">
          {jobs.hasPrevPage ? <Link rel="prev" href={`/join-us/careers?page=${page - 1}`}>Previous page</Link> : <span />}
          <p>Page {page} of {jobs.totalPages}</p>
          {jobs.hasNextPage && <Link rel="next" href={`/join-us/careers?page=${page + 1}`}>Next page</Link>}
        </nav>}
      </> : <div className="py-14">
        <h3 className="text-xl font-bold text-green-950">No open positions right now</h3>
        <p className="mt-3 max-w-xl leading-relaxed text-gray-600">Thank you for your interest in Pazelgreen. Check back for new opportunities to join our team.</p>
      </div>}
    </section>
  </main>;
}
