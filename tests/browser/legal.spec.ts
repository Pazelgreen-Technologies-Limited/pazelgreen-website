import { expect, test } from "@playwright/test";

test("footer opens approved policy with public SEO and a readable responsive layout", async ({ page }, testInfo) => {
  await page.goto("/contact");
  await page.getByRole("link", { name: "Privacy Policy", exact: true }).click();
  await expect(page).toHaveURL(/\/privacy-policy$/);
  await expect(page).toHaveTitle("Approved privacy SEO");
  await expect(page.getByRole("heading", { name: "Approved privacy policy", exact: true })).toBeVisible();
  await expect(page.getByText("Approved privacy fixture. Not company policy.", { exact: true })).toBeVisible();
  await expect(page.locator("time")).toHaveAttribute("datetime", "2027-02-01");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", "Approved privacy description");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "http://127.0.0.1:3102/privacy-policy");
  await expect(page.getByText("Private replacement policy text", { exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath("legal-policy.png"), fullPage: false });
});

test("protects legal drafts and keeps unapproved terms out of public pages", async ({ page }) => {
  await page.goto("/terms-of-service");
  await expect(page.getByRole("heading", { name: "This document is not available", exact: true })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  const policy = (await (await page.request.get("/api/legal-pages?where[identity][equals]=privacy-policy")).json()).docs[0];
  const path = `/legal/preview/${policy.id}`;
  await page.goto(path);
  await expect(page).toHaveURL(/\/admin\/login/);
  const login = await page.request.post("/api/users/login", { headers: { Origin: "http://127.0.0.1:3102" }, data: { email: "staff@pazelgreen.test", password: "integration-only-passphrase-123" } });
  expect(login.ok()).toBe(true);
  const preview = await page.goto(path);
  expect(preview?.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  expect(preview?.headers()["cache-control"]).toContain("no-store");
  expect(preview?.headers()["referrer-policy"]).toBe("no-referrer");
  await expect(page.getByRole("heading", { name: "Private privacy replacement", exact: true })).toBeVisible();
  await expect(page.getByText("Private replacement policy text", { exact: true })).toBeVisible();
  await page.goto("/privacy-policy?preview=true");
  await expect(page).toHaveTitle("Approved privacy SEO");
  await expect(page.getByRole("heading", { name: "Approved privacy policy", exact: true })).toBeVisible();
});
