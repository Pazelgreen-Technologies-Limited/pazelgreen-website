import { describe, expect, it } from "vitest";
import { advertReference, advertYear, dictionaryCodePattern, jobIsOpen } from "../../cms/career-rules";

describe("advert reference rules", () => {
  it("uses the Lagos calendar year at the UTC year boundary", () => {
    expect(advertYear(new Date("2026-12-31T22:59:59Z"))).toBe(2026);
    expect(advertYear(new Date("2026-12-31T23:00:00Z"))).toBe(2027);
  });
  it("pads the annual sequence without wrapping at 100", () => {
    expect(advertReference("D", "TE", "DH", 2027, 1)).toBe("D-TE | DH-2027-01");
    expect(advertReference("C", "AG", "S2", 2027, 100)).toBe("C-AG | S2-2027-100");
    expect(() => advertReference("D", "T-E", "DH", 2027, 1)).toThrow();
    expect(() => advertReference("D", "TE", "DH", 2027, 0)).toThrow();
  });
  it.each(["D-TE", "A B", "A|B", "A_1", "1A", "a", "ABCDEFGHIJKLM"])("rejects ambiguous dictionary code %s", code => {
    expect(dictionaryCodePattern.test(code)).toBe(false);
  });
});
describe("job eligibility", () => {
  const now = new Date("2026-11-14T12:00:00Z");
  it("closes exactly at the deadline, independently of timezone labels", () => {
    expect(jobIsOpen({ state: "open", deadline: "2026-11-14T13:00:00+01:00" }, now)).toBe(false);
    expect(jobIsOpen({ state: "open", deadline: "2026-11-14T12:00:01Z" }, now)).toBe(true);
    expect(jobIsOpen({ state: "open" }, now)).toBe(true);
    expect(jobIsOpen({ state: "closed", deadline: "2027-01-01T00:00:00Z" }, now)).toBe(false);
  });
});
