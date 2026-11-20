import { expect, test } from "@playwright/test";

test("shows approved openings and connects Join Us to role details", async ({ page }, testInfo) => {
  await page.goto("/join-us");
  await page.getByRole("link", { name: "Field systems engineer", exact: true }).click();
  await expect(page).toHaveURL(/\/join-us\/careers\/field-systems-engineer$/);
  await expect(page).toHaveTitle("Approved engineering opportunity");
  await expect(page.getByRole("heading", { name: "Field systems engineer", exact: true })).toBeVisible();
  await expect(page.getByText("Interested in this role?", { exact: true })).toBeVisible();
  await expect(page.getByRole("article").getByText(/REF-ID: D-TE \| DH-/)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath("career-detail.png"), fullPage: true });
  await page.getByRole("link", { name: "All open positions", exact: true }).click();
  await expect(page).toHaveTitle("Approved careers listing SEO");
  await expect(page.getByRole("article")).toHaveCount(1);
  await expect(page.getByText("Private revised engineering vacancy", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Closed field coordinator", { exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("keeps closed/expired details informative and unpublished details private", async ({ page }) => {
  for (const slug of ["closed-vacancy", "expired-vacancy"]) {
    await page.goto(`/join-us/careers/${slug}`);
    await expect(page.getByRole("heading", { name: "Applications are closed", exact: true })).toBeVisible();
    await expect(page.getByText("Interested in this role?", { exact: true })).toHaveCount(0);
    await page.getByRole("link", { name: "Explore open positions", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Open positions", exact: true })).toBeVisible();
  }
  for (const slug of ["private-vacancy", "withdrawn-vacancy"]) {
    await page.goto(`/join-us/careers/${slug}`);
    await expect(page.getByRole("heading", { name: "Position or page not found" })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  }
});

test("authenticates job previews while the normal route keeps approved content", async ({ page }) => {
  const job = (await (await page.request.get("/api/jobs?where[slug][equals]=field-systems-engineer")).json()).docs[0];
  const previewPath = `/join-us/careers/preview/${job.id}`;
  await page.goto(previewPath);
  await expect(page).toHaveURL(/\/admin\/login/);
  const login = await page.request.post("/api/users/login", { headers: { Origin: "http://127.0.0.1:3102" }, data: { email: "staff@pazelgreen.test", password: "integration-only-passphrase-123" } });
  expect(login.ok()).toBe(true);
  const response = await page.goto(previewPath);
  expect(response?.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  await expect(page.getByRole("heading", { name: "Private revised engineering vacancy", exact: true })).toBeVisible();
  await expect(page.getByText("Draft preview.", { exact: false })).toBeVisible();
  await page.goto("/join-us/careers/field-systems-engineer?preview=true");
  await expect(page.getByRole("heading", { name: "Field systems engineer", exact: true })).toBeVisible();
});
