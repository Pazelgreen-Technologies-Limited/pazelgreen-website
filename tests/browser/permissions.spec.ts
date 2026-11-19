import { expect, test } from "@playwright/test";

const origin = "http://127.0.0.1:3102";
const password = "integration-only-passphrase-123";
test.use({ extraHTTPHeaders: { Origin: origin } });

test("blog editors see assigned collections and cannot open unrelated admin sections", async ({ page }) => {
  const login = await page.request.post("/api/users/login", { headers: { Origin: origin }, data: { email: "blog-editor@pazelgreen.test", password } });
  expect(login.ok()).toBe(true);
  await page.goto("/admin");
  await expect(page.locator('a[href="/admin/collections/posts"]:visible').first()).toBeVisible();
  await expect(page.locator('a[href="/admin/collections/categories"]:visible').first()).toBeVisible();
  for (const href of ["/admin/collections/jobs", "/admin/collections/applications", "/admin/collections/faqs", "/admin/globals/company-settings", "/admin/globals/page-seo"]) {
    await expect(page.locator(`a[href="${href}"]`)).toHaveCount(0);
  }
  await page.goto("/admin/collections/jobs");
  await expect(page.getByRole("heading", { name: "This page could not be found.", exact: true })).toBeVisible();
  const legal = (await (await page.request.get("/api/legal-pages")).json()).docs[0];
  await page.goto(`/legal/preview/${legal.id}`);
  await expect(page.getByText("Private privacy replacement", { exact: true })).toHaveCount(0);
});

test("view-only staff can open a draft and preview but cannot save changes", async ({ page }) => {
  const login = await page.request.post("/api/users/login", { headers: { Origin: origin }, data: { email: "blog-viewer@pazelgreen.test", password } });
  expect(login.ok()).toBe(true);
  const post = (await (await page.request.get("/api/posts?draft=true&where[slug][equals]=permission-fixture")).json()).docs[0];
  expect(post).toBeTruthy();
  await page.goto(`/admin/collections/posts/${post.id}`);
  await expect(page.getByLabel("Title", { exact: true })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Save Draft", exact: true })).toHaveCount(0);
  await page.goto(`/blog/preview/${post.id}`);
  await expect(page.getByRole("heading", { name: post.title, exact: true })).toBeVisible();
  // Blog access does not imply access to private media drafts.
  const illustratedPost = (await (await page.request.get("/api/posts?where[slug][equals]=field-notes")).json()).docs[0];
  await page.goto(`/blog/preview/${illustratedPost.id}`);
  await expect(page.getByRole("heading", { name: "Private revised field notes", exact: true })).toBeVisible();
  // The saved replacement draft has a cover image and text, without an inline image.
  const image = page.getByRole("article").getByRole("img");
  await expect(image).toHaveCount(1);
  await expect(image).toHaveAttribute("alt", illustratedPost.coverImage.alt);
  await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
});

test("admins can assign section permissions through the user editor", async ({ page }) => {
  const login = await page.request.post("/api/users/login", { headers: { Origin: origin }, data: { email: "admin@pazelgreen.test", password } });
  expect(login.ok()).toBe(true);
  const user = (await (await page.request.get("/api/users?where[email][equals]=blog-viewer@pazelgreen.test")).json()).docs[0];
  await page.goto(`/admin/collections/users/${user.id}`);
  await expect(page.getByText("Staff section permissions", { exact: true })).toBeVisible();
  const company = page.locator("#field-permissions__company");
  await company.scrollIntoViewIfNeeded();
  await company.click();
  await page.getByRole("option", { name: "View", exact: true }).click();
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect.poll(async () => (await (await page.request.get(`/api/users/${user.id}`)).json()).permissions.company).toBe("read");
  // Restore the shared fixture for the other viewport.
  const reset = await page.request.patch(`/api/users/${user.id}`, { headers: { Origin: origin }, data: { permissions: { company: "none" } } });
  expect(reset.ok()).toBe(true);
});
