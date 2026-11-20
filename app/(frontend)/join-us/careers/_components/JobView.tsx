import Link from "next/link";
import type { Job } from "@/payload-types";
import { jobIsOpen } from "@/cms/career-rules";
import { ApplicationSection } from "./ApplicationSection";
import { RefreshAt } from "@/components/RefreshAt";

export function JobView({ job, preview = false }: { job: Job; preview?: boolean }) {
  const open = jobIsOpen(job);
  let deadline: string | undefined;
  if (job.deadline) {
    try { deadline = new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeStyle: "short", timeZone: job.deadlineTimezone || "Africa/Lagos" }).format(new Date(job.deadline)); }
    catch { deadline = "Check the deadline and timezone before publication"; }
  }
  return <main className="px-6 pb-20 pt-36 md:pt-44">
    {!preview && open && <RefreshAt timestamps={[job.deadline]} />}
    <article className="mx-auto max-w-3xl break-words">
      <Link href="/join-us/careers" className="font-semibold text-green-800 underline underline-offset-4">All open positions</Link>
      {preview && <p role="status" className="mt-6 rounded-lg border border-orange-300 bg-orange-50 p-4 text-orange-950">Draft preview. This content has not been approved for the public website.</p>}
      <p className="mt-8 text-sm font-semibold text-green-800">{job.reference ? `REF-ID: ${job.reference}` : "Reference assigned on first approval"}</p>
      <h1 className="mt-3 text-3xl font-extrabold leading-tight text-green-950 md:text-5xl">{job.title || "Untitled vacancy"}</h1>
      <dl className="mt-7 grid grid-cols-1 gap-5 rounded-xl bg-green-50 p-6 text-sm sm:grid-cols-2">
        <div><dt className="font-bold text-green-950">Location</dt><dd className="mt-1">{job.location} · <span className="capitalize">{job.arrangement}</span></dd></div>
        <div><dt className="font-bold text-green-950">Employment</dt><dd className="mt-1">{typeof job.employmentType === "object" && job.employmentType ? job.employmentType.name : job.employmentCode}</dd></div>
        <div><dt className="font-bold text-green-950">Department</dt><dd className="mt-1">{typeof job.department === "object" && job.department ? job.department.name : job.departmentCode}</dd></div>
        <div><dt className="font-bold text-green-950">Application deadline</dt><dd className="mt-1">{deadline ? `${deadline} (${job.deadlineTimezone})` : "Open until filled"}</dd></div>
        {job.compensation && <div className="sm:col-span-2"><dt className="font-bold text-green-950">Compensation</dt><dd className="mt-1">{job.compensation}</dd></div>}
      </dl>
      <p className="mt-8 whitespace-pre-line leading-relaxed text-gray-700">{job.summary}</p>
      {([ ["Responsibilities", job.responsibilities ?? ""], ["Requirements", job.requirements ?? ""] ] as const).map(([title, text]) => <section key={title} className="mt-10">
        <h2 className="text-2xl font-bold text-green-950">{title}</h2>
        <ul className="mt-4 list-disc space-y-3 pl-6 leading-relaxed text-gray-700">{text.split(/\r?\n/).filter(line => line.trim()).map((line, index) => <li key={index}>{line}</li>)}</ul>
      </section>)}
      <section aria-label="Applications" className="mt-12 rounded-xl border border-green-950/15 p-6">
        <h2 className="text-xl font-bold text-green-950">{open ? "Interested in this role?" : "Applications are closed"}</h2>
        {open ? preview ? <p className="mt-3 text-gray-600">Applications are disabled in draft previews.</p> : <ApplicationSection job={job.id} /> : <p className="mt-3 leading-relaxed text-gray-600">This advert is no longer accepting applications. Explore our current openings for other opportunities.</p>}
        {!open && <Link href="/join-us/careers" className="mt-4 inline-block font-bold text-green-800 underline underline-offset-4">Explore open positions</Link>}
      </section>
    </article>
  </main>;
}
