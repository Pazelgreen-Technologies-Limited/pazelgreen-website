import "server-only";
import { getPayload } from "payload";
import config from "@payload-config";
import { connection } from "next/server";
import { announcementSnapshot } from "@/cms/announcement-rules";

export async function getAnnouncementSnapshot() {
  await connection();
  const payload = await getPayload({ config });
  // Publication audit timestamps influence selection but are never returned.
  const records = await payload.find({ collection: "announcements", where: { and: [{ _status: { equals: "published" } }, { enabled: { equals: true } }] }, draft: false, overrideAccess: true, depth: 0, pagination: false, limit: 0,
    select: { message: true, linkLabel: true, linkURL: true, enabled: true, startsAt: true, endsAt: true, priority: true, publishedAt: true } });
  return announcementSnapshot(records.docs);
}
