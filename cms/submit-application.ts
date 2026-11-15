import { createHash, createHmac, randomUUID } from "node:crypto";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { APIError, createLocalReq, type Payload } from "payload";
import { sql } from "@payloadcms/db-postgres";
import { transactionDatabase } from "./transactions";
import { applicantReference, validateCV } from "./recruitment-rules";
import { jobIsOpen } from "./career-rules";

function text(form: FormData, key: string, max: number, required = false) {
  const value = form.get(key);
  if (value === null && !required) return "";
  if (typeof value !== "string" || value.trim().length > max || required && !value.trim()) throw new APIError(`Check the ${key} field.`, 400);
  return value.trim();
}

export async function submitApplication(payload: Payload, form: FormData) {
  const fullName = text(form, "fullName", 160, true), email = text(form, "email", 254, true).toLowerCase();
  const phone = text(form, "phone", 50), portfolio = text(form, "portfolio", 1000), message = text(form, "message", 4000);
  const key = text(form, "key", 100, true), job = text(form, "job", 20, true), noticeVersion = text(form, "noticeVersion", 100, true);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^[a-f0-9-]{36}$/i.test(key) || !/^\d+$/.test(job) || form.get("consent") !== "yes" || form.get("website")) throw new APIError("Check the application fields and privacy acknowledgement.", 400);
  if (portfolio) { try { if (!["https:", "http:"].includes(new URL(portfolio).protocol)) throw new Error(); } catch { throw new APIError("Portfolio must be an HTTP(S) URL.", 400); } }
  const file = form.get("cv");
  if (!(file instanceof File)) throw new APIError("Choose a PDF or DOCX CV.", 400);
  const bytes = Buffer.from(await file.arrayBuffer());
  let mime: string;
  try { mime = validateCV(bytes, file.name); } catch (error) { throw new APIError((error as Error).message, 400); }
  const digest = (value: string) => createHmac("sha256", payload.secret).update(value).digest("hex");
  const submissionKey = digest(key);
  const fingerprint = digest(JSON.stringify([fullName, email, phone, portfolio, message, job, noticeVersion, createHash("sha256").update(bytes).digest("hex")]));
  const transaction = await payload.db.beginTransaction();
  if (!transaction) throw new APIError("Submission is temporarily unavailable.", 503);
  const req = await createLocalReq({ context: { submitApplication: true } }, payload);
  req.transactionID = transaction;
  const db = transactionDatabase(payload, transaction);
  let uploadedPath: string | undefined;
  try {
    // Consistent lock order: retry token, email abuse bucket, then advert.
    await db.execute(sql`SELECT pg_advisory_xact_lock(hashtextextended(${`submission:${submissionKey}`}, 0))`);
    const existing = (await payload.find({ collection: "applications", where: { submissionKey: { equals: submissionKey } }, limit: 1, depth: 0, req, overrideAccess: true })).docs[0];
    if (existing) {
      if (existing.fingerprint !== fingerprint) throw new APIError("This submission token was already used. Reload the form for a new application.", 409);
      await payload.db.commitTransaction(transaction);
      return { reference: existing.reference };
    }
    const hour = Math.floor(Date.now() / 3600000);
    for (const [bucket, limit] of [[`global:${hour}`, 1000], [`email:${digest(email)}:${hour}`, 5]] as const) {
      const result = await db.execute(sql`INSERT INTO recruitment_rate_limits (bucket, value) VALUES (${bucket}, 1) ON CONFLICT (bucket) DO UPDATE SET value = recruitment_rate_limits.value + 1 RETURNING value`);
      if (Number(result.rows[0].value) > limit) throw new APIError("Too many applications. Please try again later.", 429);
    }
    await db.execute(sql`SELECT pg_advisory_xact_lock(hashtextextended(${`jobs:${job}`}, 0))`);
    const advert = await payload.findByID({ collection: "jobs", id: Number(job), draft: false, depth: 0, overrideAccess: true, req });
    if (advert._status !== "published" || !jobIsOpen(advert) || !advert.reference) throw new APIError("This role is no longer accepting applications.", 409);
    const settings = await payload.findGlobal({ slug: "recruitment-settings", draft: false, depth: 0, overrideAccess: true, req });
    if (settings._status !== "published" || !settings.enabled || !settings.privacyNotice || !settings.retentionDays) throw new APIError("Online applications are not currently available.", 409);
    if (settings.noticeVersion !== noticeVersion) throw new APIError("The recruitment notice has changed. Reload and review it before applying.", 409);
    const sequence = Number((await db.execute(sql`INSERT INTO applicant_counters (job_id, value) VALUES (${advert.id}, 1) ON CONFLICT (job_id) DO UPDATE SET value = applicant_counters.value + 1 RETURNING value`)).rows[0].value);
    const duplicate = (await payload.count({ collection: "applications", where: { and: [{ job: { equals: advert.id } }, { email: { equals: email } }] }, req, overrideAccess: true })).totalDocs > 0;
    const cv = await payload.create({ collection: "private-files", data: {}, file: { data: bytes, mimetype: mime, name: `${randomUUID()}.${mime === "application/pdf" ? "pdf" : "docx"}`, size: bytes.length }, req, overrideAccess: true });
    const upload = payload.collections["private-files"].config.upload;
    if (upload && typeof upload === "object" && cv.filename && path.basename(cv.filename) === cv.filename) uploadedPath = path.resolve(upload.staticDir!, cv.filename);
    const now = new Date();
    const application = await payload.create({ collection: "applications", req, overrideAccess: true, data: {
      reference: applicantReference(advert.reference, sequence), job: advert.id, sequence, submissionKey, fingerprint,
      fullName, email, phone, portfolio, message, cv: cv.id, noticeVersion, noticeSnapshot: settings.privacyNotice,
      consentedAt: now.toISOString(), retentionReviewAt: new Date(now.getTime() + settings.retentionDays * 86400000).toISOString(),
      duplicate, status: "new", candidateDelivery: "pending", staffDelivery: "pending", deliveryAttempts: 0, nextDeliveryAt: now.toISOString(),
    } });
    await payload.db.commitTransaction(transaction);
    return { reference: application.reference };
  } catch (error) {
    await payload.db.rollbackTransaction(transaction);
    // Filesystem writes are outside PostgreSQL; remove this attempt's random file.
    if (uploadedPath) await unlink(uploadedPath).catch(() => undefined);
    throw error;
  }
}
