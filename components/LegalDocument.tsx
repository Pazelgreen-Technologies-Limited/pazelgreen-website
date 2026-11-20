import Link from "next/link";
import type { LegalPage } from "@/payload-types";
import { RichTextBody } from "./RichTextBody";

export function LegalDocument({ page, preview = false }: { page: LegalPage; preview?: boolean }) {
  let date = "Effective date not set";
  if (page.effectiveDate && Number.isFinite(Date.parse(page.effectiveDate))) date = new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "UTC" }).format(new Date(page.effectiveDate));
  return <main className="px-6 pb-20 pt-36 md:pt-44">
    <article className="mx-auto max-w-3xl break-words">
      {preview && <aside className="mb-7 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950">Draft preview. This document has not been approved for publication. <Link href={`/admin/collections/legal-pages/${page.id}`} className="font-bold underline">Return to the editor</Link></aside>}
      <p className="text-sm font-bold uppercase tracking-wide text-green-800">Pazelgreen</p>
      <h1 className="mt-3 text-4xl font-extrabold leading-tight text-green-950 md:text-5xl">{page.title || "Untitled legal draft"}</h1>
      <p className="mb-10 mt-5 text-sm text-gray-600">Effective date: <time dateTime={page.effectiveDate || undefined}>{date}</time></p>
      <RichTextBody body={page.body} preview={preview} />
    </article>
  </main>;
}

export function LegalUnavailable() {
  return <main className="mx-auto max-w-3xl px-6 pb-24 pt-40">
    <h1 className="text-3xl font-extrabold text-green-950">This document is not available</h1>
    <p className="mt-5 text-gray-600">The requested legal document has not been published. Please check back later.</p>
    <Link href="/" className="mt-6 inline-block font-bold text-green-800 underline">Return home</Link>
  </main>;
}
