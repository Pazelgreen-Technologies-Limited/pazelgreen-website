import { describe, expect, it } from "vitest";
import type { PayloadRequest } from "payload";
import { canAccessSection, contentSections, sections } from "../../cms/permissions";

const user = (overrides: Partial<NonNullable<PayloadRequest["user"]>> = {}): NonNullable<PayloadRequest["user"]> => ({
  id: 1, collection: "users", name: "Permission test", email: "permissions@pazelgreen.test",
  role: "staff", active: true, mustChangePassword: false, createdAt: "", updatedAt: "", ...overrides,
});

describe("section permission policy", () => {
  for (const section of Object.keys(sections) as (keyof typeof sections)[]) {
    it(`enforces none/view/modify and account state for ${section}`, () => {
      for (const level of [undefined, null, "none", "read", "modify"] as const) {
        const staff = user({ permissions: { [section]: level } });
        expect(canAccessSection(staff, section)).toBe(level === "read" || level === "modify");
        expect(canAccessSection(staff, section, "modify")).toBe(level === "modify");
        expect(canAccessSection({ ...staff, active: false }, section)).toBe(false);
        expect(canAccessSection({ ...staff, mustChangePassword: true }, section)).toBe(false);
      }
      expect(canAccessSection(null, section)).toBe(false);
      expect(canAccessSection(user({ role: "admin" }), section, "modify")).toBe(true);
      expect(canAccessSection(user({ role: "admin", active: false }), section)).toBe(false);
      expect(canAccessSection(user({ role: "admin", mustChangePassword: true }), section)).toBe(false);
    });
  }

  it("does not grant access to other sections implicitly", () => {
    const staff = user({ permissions: { blog: "modify" } });
    expect(canAccessSection(staff, "media")).toBe(false);
    expect(canAccessSection(staff, "company")).toBe(false);
    expect(canAccessSection(staff, "recruitment")).toBe(false);
    expect(contentSections.posts).toBe("blog");
    expect(contentSections.categories).toBe("blog");
  });
});
