import { getAnnouncementSnapshot } from "@/lib/announcements";

export async function GET() {
  return Response.json(await getAnnouncementSnapshot(), { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
}
