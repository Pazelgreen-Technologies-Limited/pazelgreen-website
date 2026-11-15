import { expect, test } from "@playwright/test";

test("announcements sit above navigation without overlap or mobile overflow", async ({ page }, testInfo) => {
  await page.goto("/blog");
  const bar = page.getByRole("region", { name: "Site announcement", exact: true });
  await expect(bar).toContainText("Approved company notice");
  await expect(bar.getByRole("link", { name: "View opportunities" })).toHaveAttribute("href", "/join-us/careers");
  const notice = await bar.boundingBox(), nav = await page.getByRole("navigation", { name: "Main navigation", exact: true }).boundingBox();
  expect(nav!.y).toBeGreaterThanOrEqual(notice!.y + notice!.height);
  const heading = await page.getByRole("heading", { name: "News & insights" }).boundingBox();
  expect(heading!.y).toBeGreaterThan(nav!.y + nav!.height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const toggle = page.getByRole("button", { name: "Toggle navigation menu" });
  if (await toggle.isVisible()) {
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await page.locator("#mobile-navigation").getByRole("link", { name: "About Us", exact: true }).click();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#mobile-navigation")).toBeHidden();
  }
  await page.screenshot({ path: testInfo.outputPath("announcement-navigation.png"), fullPage: true });
});

test("activates and expires schedules on an already open page", async ({ page, request }) => {
  const headers = { Origin: "http://127.0.0.1:3102" };
  const login = await request.post("/api/users/login", { headers, data: { email: "admin@pazelgreen.test", password: "integration-only-passphrase-123" } });
  const token = (await login.json()).token;
  const auth = { ...headers, Authorization: `JWT ${token}` };
  const start = Date.now() + 5000, end = start + 5000;
  const created = await request.post("/api/announcements?draft=true", { headers: auth, data: { title: "Browser schedule test", message: "Temporary scheduled browser notice", enabled: true, priority: 9999, startsAt: new Date(start).toISOString(), endsAt: new Date(end).toISOString() } });
  expect(created.status()).toBe(201);
  const id = (await created.json()).doc.id;
  try {
    expect((await request.patch(`/api/announcements/${id}?draft=true`, { headers: auth, data: { reviewState: "in-review" } })).ok()).toBe(true);
    expect((await request.patch(`/api/announcements/${id}`, { headers: auth, data: { _status: "published" } })).ok()).toBe(true);
    await page.goto("/blog");
    const bar = page.getByRole("region", { name: "Site announcement", exact: true });
    await expect(bar).toContainText("Approved company notice");
    await expect(bar).toContainText("Temporary scheduled browser notice", { timeout: 10000 });
    await expect(bar).toContainText("Approved company notice", { timeout: 10000 });
  } finally { await request.patch(`/api/announcements/${id}`, { headers: auth, data: { _status: "draft" } }); }
});
