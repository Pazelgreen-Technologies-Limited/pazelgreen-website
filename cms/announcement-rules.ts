export interface ScheduledAnnouncement {
  id: number; message: string; linkLabel?: string | null; linkURL?: string | null;
  enabled?: boolean | null; startsAt?: string | null; endsAt?: string | null;
  priority?: number | null; publishedAt?: string | null;
}
export interface AnnouncementSnapshot {
  notice: Pick<ScheduledAnnouncement, "id" | "message" | "linkLabel" | "linkURL" | "endsAt"> | null;
  nextChangeAt: string | null;
  generatedAt: string;
}

export function announcementSnapshot(records: ScheduledAnnouncement[], now = new Date()): AnnouncementSnapshot {
  const time = now.getTime();
  const enabled = records.filter(item => item.enabled);
  const eligible = enabled.filter(item => (!item.startsAt || Date.parse(item.startsAt) <= time) && (!item.endsAt || Date.parse(item.endsAt) > time));
  eligible.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0) || Date.parse(b.publishedAt ?? "1970-01-01") - Date.parse(a.publishedAt ?? "1970-01-01") || a.id - b.id);
  const selected = eligible[0];
  const boundaries = enabled.flatMap(item => [item.startsAt, item.endsAt]).filter((value): value is string => Boolean(value) && Date.parse(value!) > time).sort((a, b) => Date.parse(a) - Date.parse(b));
  return { notice: selected ? { id: selected.id, message: selected.message, linkLabel: selected.linkLabel, linkURL: selected.linkURL, endsAt: selected.endsAt } : null,
    nextChangeAt: boundaries[0] ?? null, generatedAt: now.toISOString() };
}
