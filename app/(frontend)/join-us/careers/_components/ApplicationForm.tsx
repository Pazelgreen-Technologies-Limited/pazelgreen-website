"use client";

import { useRef, useState, type FormEvent } from "react";

export function ApplicationForm({ job, notice, version }: { job: number; notice: string; version: string }) {
  const token = useRef<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    token.current ??= crypto.randomUUID();
    form.set("key", token.current);
    form.set("job", String(job));
    form.set("noticeVersion", version);
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/recruitment/apply", { method: "POST", body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to submit. Please retry.");
      setReference(result.reference);
    } catch (error) { setError(error instanceof Error ? error.message : "Unable to submit. Please retry."); }
    finally { setBusy(false); }
  }
  if (reference) return <div role="status" className="mt-6 rounded-xl bg-green-50 p-6" tabIndex={0}>
    <h3 className="text-xl font-bold text-green-950">Application received</h3>
    <p className="mt-3">Your application reference: <strong className="break-words">{reference}</strong></p>
    <p className="mt-3">Save this reference. Your application is stored, and an acknowledgement email is queued for delivery.</p>
  </div>;
  const input = "mt-2 w-full rounded-lg border border-gray-400 bg-white px-3 py-3 text-gray-950 focus:outline-2 focus:outline-offset-2 focus:outline-green-800";
  return <form onSubmit={submit} className="mt-6 space-y-5" aria-label="Job application" aria-busy={busy}>
    <p className="text-sm text-gray-600">Fields marked * are required.</p>
    <label className="block font-semibold">Full name *<input name="fullName" autoComplete="name" required maxLength={160} className={input} /></label>
    <label className="block font-semibold">Email *<input name="email" type="email" autoComplete="email" required maxLength={254} className={input} /></label>
    <label className="block font-semibold">Phone<input name="phone" type="tel" autoComplete="tel" maxLength={50} className={input} /></label>
    <label className="block font-semibold">Portfolio or LinkedIn URL<input name="portfolio" type="url" maxLength={1000} className={input} /></label>
    <label className="block font-semibold">Supporting message<textarea name="message" maxLength={4000} rows={4} className={input} /></label>
    <label className="block font-semibold">CV *<input name="cv" type="file" accept=".pdf,.docx" required className={`${input} text-sm`} aria-describedby="cv-help" /></label>
    <p id="cv-help" className="text-sm text-gray-600">PDF or DOCX, maximum 5 MB. Your CV is accessible only to our recruitment team.</p>
    <div className="hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <section aria-label="Recruitment privacy notice" className="rounded-lg bg-gray-50 p-4">
      <h3 className="font-bold">Recruitment privacy notice</h3><p className="mt-2 whitespace-pre-line text-sm leading-relaxed">{notice}</p>
      <p className="mt-2 text-xs">Version: {version}</p>
    </section>
    <label className="flex items-start gap-3 text-sm"><input name="consent" type="checkbox" value="yes" required className="mt-1 h-4 w-4 shrink-0" /><span>I acknowledge the recruitment privacy notice. *</span></label>
    {error && <p role="alert" className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-900">{error}</p>}
    <button disabled={busy} className="rounded-lg bg-green-800 px-6 py-3 font-bold text-white focus:outline-2 focus:outline-offset-2 focus:outline-green-800 disabled:opacity-60">{busy ? "Submitting…" : "Submit application"}</button>
    <p className="text-xs text-gray-600">If delivery is interrupted, keep this page open and retry the same form to avoid duplicate submissions.</p>
  </form>;
}
