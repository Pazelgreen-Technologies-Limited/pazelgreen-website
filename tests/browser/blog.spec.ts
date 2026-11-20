import { expect, test } from "@playwright/test";

test("lists published articles, paginates and resets the page on category changes", async ({ page }, testInfo) => {
  await page.goto("/blog");
  await expect(page.getByRole("heading", { name: "News & insights" })).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(6);
  await expect(page.getByText("Private revised field notes", { exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("listing.png"), fullPage: true });
  await page.getByRole("link", { name: "Next page", exact: true }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(page.getByRole("article")).toHaveCount(1);
  await page.getByRole("navigation", { name: "Filter articles by category" }).getByRole("link", { name: "Food systems", exact: true }).click();
  await expect(page).toHaveURL(/category=food-systems$/);
  await expect(page.getByRole("article")).toHaveCount(6);
});

test("explains an empty category and gives a working route back to all articles", async ({ page }) => {
  await page.goto("/blog?category=company-updates");
  await expect(page.getByRole("heading", { name: "No articles in this category yet" })).toBeVisible();
  await page.getByRole("link", { name: "View all articles", exact: true }).click();
  await expect(page).toHaveURL(/\/blog$/);
  await expect(page.getByRole("article")).toHaveCount(6);
});

test("renders an accessible article, public attribution and approved images without overflow", async ({ page }, testInfo) => {
  await page.goto("/blog/field-notes");
  await expect(page).toHaveTitle("Approved field notes SEO");
  await expect(page.getByRole("heading", { name: "Field notes: stronger food systems", exact: true })).toBeVisible();
  await expect(page.getByText("By Pazelgreen editorial team", { exact: true })).toBeVisible();
  await expect(page.getByText("Approved article body about connected agricultural systems.", { exact: true })).toBeVisible();
  const images = page.getByRole("article").getByRole("img");
  await expect(images).toHaveCount(2);
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath("article.png"), fullPage: true });
});

test("keeps unpublished URLs private and protects draft preview with a real CMS session", async ({ page }) => {
  await page.goto("/blog/draft-only-story");
  await expect(page.getByRole("heading", { name: "Article or page not found" })).toBeVisible();
  const anonymous = await page.request.get("/api/posts?where[slug][equals]=draft-only-story");
  expect((await anonymous.json()).docs).toHaveLength(0);
  const published = (await (await page.request.get("/api/posts?where[slug][equals]=field-notes")).json()).docs[0];
  await page.goto(`/blog/preview/${published.id}`);
  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.getByText("Private revised field notes", { exact: true })).toHaveCount(0);
  const login = await page.request.post("/api/users/login", { headers: { Origin: "http://127.0.0.1:3102" }, data: { email: "staff@pazelgreen.test", password: "integration-only-passphrase-123" } });
  expect(login.ok()).toBe(true);
  const drafts = await page.request.get("/api/posts?draft=true&where[slug][equals]=draft-only-story", { headers: { Origin: "http://127.0.0.1:3102" } });
  const draft = (await drafts.json()).docs[0];
  expect(draft).toBeTruthy();
  await page.goto(`/blog/preview/${draft.id}`);
  await expect(page.getByRole("heading", { name: "Private draft-only story" })).toBeVisible();
  await expect(page.getByText("Draft preview.", { exact: false })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  // A signed-in editor still gets the approved public version at the normal URL.
  await page.goto("/blog/field-notes?preview=true");
  await expect(page.getByRole("heading", { name: "Field notes: stronger food systems", exact: true })).toBeVisible();
});

test("provides keyboard access to category filters", async ({ page }) => {
  await page.goto("/blog");
  const filter = page.getByRole("navigation", { name: "Filter articles by category" }).getByRole("link", { name: "Company updates", exact: true });
  await filter.focus();
  await expect(filter).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "No articles in this category yet" })).toBeVisible();
});
