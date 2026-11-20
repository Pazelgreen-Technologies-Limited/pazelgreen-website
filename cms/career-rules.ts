import type { Where } from "payload";

export const dictionaryCodePattern = /^[A-Z][A-Z0-9]{0,11}$/;
export function advertYear(now = new Date()) {
  return Number(new Intl.DateTimeFormat("en", { timeZone: "Africa/Lagos", year: "numeric" }).format(now));
}
export function advertReference(employment: string, department: string, position: string, year: number, sequence: number) {
  if (![employment, department, position].every(code => dictionaryCodePattern.test(code)) || !Number.isInteger(year) || year < 2000 || !Number.isSafeInteger(sequence) || sequence < 1) throw new Error("Invalid advert reference components.");
  return `${employment}-${department} | ${position}-${year}-${String(sequence).padStart(2, "0")}`;
}
export function openJobsWhere(now = new Date()): Where {
  return { and: [{ _status: { equals: "published" } }, { state: { equals: "open" } }, { or: [{ deadline: { exists: false } }, { deadline: { greater_than: now.toISOString() } }] }] };
}
export function jobIsOpen(job: { state?: string | null; deadline?: string | null }, now = new Date()) {
  return job.state === "open" && (!job.deadline || new Date(job.deadline).getTime() > now.getTime());
}
export function validTimezone(value: unknown) {
  try { new Intl.DateTimeFormat("en", { timeZone: String(value) }); return true; }
  catch { return "Use an IANA timezone, for example Africa/Lagos."; }
}
