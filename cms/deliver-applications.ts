import { createLocalReq, type Payload } from "payload";
import { sql } from "@payloadcms/db-postgres";
import { transactionDatabase } from "./transactions";

/** Durable outbox: lock each row across send/update to serialize scheduler runs. */
export async function deliverApplications(payload: Payload, limit = 50) {
  let processed = 0;
  for (; processed < limit; processed++) {
    const tx = await payload.db.beginTransaction();
    if (!tx) throw new Error("Email delivery requires a transaction.");
    const db = transactionDatabase(payload, tx);
    const req = await createLocalReq({ context: { deliverApplication: true } }, payload);
    req.transactionID = tx;
    try {
      const result = await db.execute(sql`SELECT id FROM applications WHERE (candidate_delivery <> 'sent' OR staff_delivery <> 'sent') AND next_delivery_at <= NOW() ORDER BY next_delivery_at, id FOR UPDATE SKIP LOCKED LIMIT 1`);
      if (!result.rows.length) { await payload.db.commitTransaction(tx); break; }
      const application = await payload.findByID({ collection: "applications", id: Number(result.rows[0].id), depth: 0, req, overrideAccess: true });
      const settings = await payload.findGlobal({ slug: "recruitment-delivery", req, overrideAccess: true });
      const recipients = settings.recipients?.map(item => item.email) ?? [];
      let candidateDelivery = application.candidateDelivery, staffDelivery = application.staffDelivery;
      if (candidateDelivery !== "sent") {
        try {
          await payload.sendEmail({ to: application.email, subject: `Application received: ${application.reference}`, text: `We have received your application. Your reference is ${application.reference}. Keep this reference for future correspondence.`, messageId: `<application-${application.id}-candidate@pazelgreen>` });
          candidateDelivery = "sent";
        } catch { candidateDelivery = "failed"; }
      }
      if (staffDelivery !== "sent") {
        try {
          if (!recipients.length) throw new Error("Recruitment recipients are not configured.");
          // No applicant details or attachments in notifications. Follow the CMS link.
          await payload.sendEmail({ to: recipients, subject: `New application: ${application.reference}`, text: `Review application ${application.reference} in the CMS: ${payload.config.serverURL}/admin/collections/applications/${application.id}`, messageId: `<application-${application.id}-staff@pazelgreen>` });
          staffDelivery = "sent";
        } catch { staffDelivery = "failed"; }
      }
      const attempts = (application.deliveryAttempts ?? 0) + 1;
      await payload.update({ collection: "applications", id: application.id, overrideAccess: true, req, data: {
        candidateDelivery, staffDelivery, deliveryAttempts: attempts,
        nextDeliveryAt: new Date(Date.now() + Math.min(86400000, 60000 * 2 ** Math.min(attempts, 10))).toISOString(),
      } });
      await payload.db.commitTransaction(tx);
    } catch {
      await payload.db.rollbackTransaction(tx);
      throw new Error("Recruitment delivery failed. Inspect queue state; applicant data has been omitted from this error.");
    }
  }
  return processed;
}
