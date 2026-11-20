import { describe, expect, it } from "vitest";
import { announcementSnapshot, type ScheduledAnnouncement } from "../../cms/announcement-rules";

const record = (id: number, extra: Partial<ScheduledAnnouncement> = {}): ScheduledAnnouncement => ({ id, message: `Notice ${id}`, enabled: true, priority: 0, publishedAt: "2027-01-01T00:00:00Z", ...extra });
const now = new Date("2027-02-01T12:00:00Z");
describe("announcement scheduling", () => {
  it("renders nothing for disabled, future or expired notices and exposes only the next boundary", () => {
    const result = announcementSnapshot([record(1, { enabled: false }), record(2, { startsAt: "2027-02-01T13:00:00Z" }), record(3, { endsAt: now.toISOString() })], now);
    expect(result.notice).toBeNull(); expect(result.nextChangeAt).toBe("2027-02-01T13:00:00Z");
  });
  it("includes exact start and excludes exact end", () => {
    expect(announcementSnapshot([record(1, { startsAt: now.toISOString(), endsAt: "2027-02-01T12:00:01Z" })], now).notice?.id).toBe(1);
    expect(announcementSnapshot([record(1, { endsAt: now.toISOString() })], now).notice).toBeNull();
  });
  it("chooses priority, then latest publication, then stable ascending ID", () => {
    expect(announcementSnapshot([record(1), record(2, { priority: 1 })], now).notice?.id).toBe(2);
    expect(announcementSnapshot([record(1), record(2, { publishedAt: "2027-01-02T00:00:00Z" })], now).notice?.id).toBe(2);
    expect(announcementSnapshot([record(2), record(1)], now).notice?.id).toBe(1);
  });
  it("returns only public display fields", () => {
    const result = announcementSnapshot([record(1)], now);
    expect(result.notice).toEqual({ id: 1, message: "Notice 1", linkLabel: undefined, linkURL: undefined, endsAt: undefined });
    expect(announcementSnapshot([], now).notice).toBeNull();
  });
});
