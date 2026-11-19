import { expect, test } from "@playwright/test";
import type { CompanySetting, Job, Post } from "../../payload-types";

const origin = "http://127.0.0.1:3102";
const relation = (value: number | { id: number } | null | undefined) => typeof value === "object" ? value?.id : value;

test("sitemap lists approved routes and robots excludes administrative and private routes", async ({ request, page }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.ok()).toBe(true);
  expect(response.headers()["cache-control"]).toBe("public, max-age=0, must-revalidate");
  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  expect(urls).toHaveLength(16); // Seven static pages, seven posts, one open job, one approved policy.
  for (const url of urls) expect(new URL(url).search).toBe("");
  for (const path of ["/about", "/solutions", "/blog/field-notes", "/join-us/careers/field-systems-engineer", "/privacy-policy"]) {
    expect(xml).toContain(`<loc>${origin}${path}</loc>`);
  }
  for (const path of ["draft-only-story", "withdrawn", "private-vacancy", "closed-vacancy", "expired-vacancy", "terms-of-service", "/preview/", "/api/", "/admin", "/team", "private-draft"]) expect(xml).not.toContain(path);
  const robots = await (await request.get("/robots.txt")).text();
  for (const rule of ["Disallow: /admin", "Disallow: /api/", "Disallow: /blog/preview/", "Disallow: /legal/preview/", `Sitemap: ${origin}/sitemap.xml`]) expect(robots).toContain(rule);
  expect((await request.get("/api/posts")).headers()["x-robots-tag"]).toBe("noindex, nofollow");
  expect((await request.get("/admin/login")).headers()["x-robots-tag"]).toBe("noindex, nofollow");
  await page.goto("/contact");
  await page.locator("footer").getByRole("link", { name: "Careers", exact: true }).click();
  await expect(page).toHaveURL(`${origin}/join-us/careers`);
  await expect(page.getByRole("heading", { name: "Work with purpose", exact: true })).toBeVisible();
  for (const slug of ["closed-vacancy", "expired-vacancy"]) {
    await page.goto(`/join-us/careers/${slug}`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
  }
});

test("publication, replacement drafts, browser history and withdrawal refresh public pages and sitemap", async ({ page, request }, testInfo) => {
  const login = await request.post("/api/users/login", { headers: { Origin: origin }, data: { email: "admin@pazelgreen.test", password: "integration-only-passphrase-123" } });
  expect(login.ok()).toBe(true);
  const headers = { Origin: origin, Authorization: `JWT ${(await login.json()).token}` };
  const source = (await (await request.get("/api/posts?where[slug][equals]=field-notes")).json()).docs[0] as Post;
  const slug = `publication-browser-${testInfo.project.name}-${Date.now()}`;
  const created = await request.post("/api/posts?draft=true", { headers, data: {
    title: "Publication browser original", slug, excerpt: source.excerpt, body: source.body,
    authorName: source.authorName, publicationDate: new Date().toISOString(), coverImage: relation(source.coverImage),
    categories: source.categories?.map(relation),
  } });
  expect(created.status()).toBe(201);
  const id = (await created.json()).doc.id;
  const patch = async (data: object, draft = true) => {
    const response = await request.patch(`/api/posts/${id}${draft ? "?draft=true" : ""}`, { headers, data });
    expect(response.ok(), await response.text()).toBe(true);
  };
  const publish = async () => { await patch({ reviewState: "in-review" }); await patch({ _status: "published" }, false); };
  const sitemap = async () => (await request.get("/sitemap.xml")).text();
  try {
    expect(await sitemap()).not.toContain(`/blog/${slug}`);
    await publish();
    expect(await sitemap()).toContain(`/blog/${slug}`);
    await page.goto(`/blog/${slug}`);
    await expect(page.getByRole("heading", { name: "Publication browser original", exact: true })).toBeVisible();
    await patch({ title: "Publication browser replacement" });
    await page.reload();
    await expect(page.getByRole("heading", { name: "Publication browser original", exact: true })).toBeVisible();
    await page.getByRole("link", { name: "All articles", exact: true }).click();
    await expect(page).toHaveURL(`${origin}/blog`);
    await expect(page.getByRole("heading", { name: "News & insights", exact: true })).toBeVisible();
    await publish();
    await page.goBack();
    await expect(page.getByRole("heading", { name: "Publication browser replacement", exact: true })).toBeVisible();
    await patch({ _status: "draft" }, false);
    expect(await sitemap()).not.toContain(`/blog/${slug}`);
    await page.getByRole("link", { name: "All articles", exact: true }).click();
    await expect(page).toHaveURL(`${origin}/blog`);
    await expect(page.getByRole("heading", { name: "News & insights", exact: true })).toBeVisible();
    await page.goBack();
    await expect(page.getByRole("heading", { name: "Article or page not found", exact: true })).toBeVisible();
  } finally { await patch({ _status: "draft" }, false); }
});

test("shared footer refreshes approved settings during client navigation and preserves drafts", async ({ page, request }) => {
  const login = await request.post("/api/users/login", { headers: { Origin: origin }, data: { email: "admin@pazelgreen.test", password: "integration-only-passphrase-123" } });
  const headers = { Origin: origin, Authorization: `JWT ${(await login.json()).token}` };
  const live = await (await request.get("/api/globals/company-settings")).json() as CompanySetting;
  const draft = await (await request.get("/api/globals/company-settings?draft=true", { headers })).json() as CompanySetting;
  const content = (record: CompanySetting) => Object.fromEntries((["email", "phone", "address", "timezone", "departmentContacts", "workingHours", "socialLinks"] as const).map(key => [key, record[key]]));
  const save = async (data: object) => {
    const response = await request.post("/api/globals/company-settings", { headers, data });
    expect(response.ok(), await response.text()).toBe(true);
  };
  const publish = async (data: object) => { await save(data); await save({ reviewState: "in-review" }); await save({ _status: "published" }); };
  await page.goto("/blog");
  try {
    await publish({ ...content(live), email: "navigation-approved@pazelgreen.test" });
    await save({ email: "navigation-private@pazelgreen.test" });
    await page.getByRole("navigation", { name: "Filter articles by category" }).getByRole("link", { name: "Food systems", exact: true }).click();
    await expect(page).toHaveURL(`${origin}/blog?category=food-systems`);
    await expect(page.locator("footer").getByRole("link", { name: "navigation-approved@pazelgreen.test", exact: true })).toBeVisible();
    await page.locator("footer").getByRole("link", { name: "Careers", exact: true }).click();
    await expect(page.locator("footer").getByRole("link", { name: "navigation-approved@pazelgreen.test", exact: true })).toBeVisible();
    await expect(page.locator("footer").getByText("navigation-private@pazelgreen.test", { exact: true })).toHaveCount(0);
  } finally {
    await publish(content(live));
    await save(content(draft));
  }
});

test("an open job expires in the browser and sitemap without another publish", async ({ page, request }, testInfo) => {
  test.setTimeout(45000);
  const login = await request.post("/api/users/login", { headers: { Origin: origin }, data: { email: "admin@pazelgreen.test", password: "integration-only-passphrase-123" } });
  const headers = { Origin: origin, Authorization: `JWT ${(await login.json()).token}` };
  const source = (await (await request.get("/api/jobs?where[slug][equals]=field-systems-engineer")).json()).docs[0] as Job;
  const slug = `deadline-browser-${testInfo.project.name}-${Date.now()}`;
  const created = await request.post("/api/jobs?draft=true", { headers, data: {
    title: "Browser deadline vacancy", slug, employmentType: relation(source.employmentType), department: relation(source.department),
    positionCode: relation(source.positionCode), location: source.location, arrangement: source.arrangement,
    summary: source.summary, responsibilities: source.responsibilities, requirements: source.requirements,
    state: "open", deadlineTimezone: "Africa/Lagos", deadline: new Date(Date.now() + 15000).toISOString(),
  } });
  expect(created.status()).toBe(201);
  const id = (await created.json()).doc.id;
  const listing = await page.context().newPage();
  const joinUs = await page.context().newPage();
  try {
    expect((await request.patch(`/api/jobs/${id}?draft=true`, { headers, data: { reviewState: "in-review" } })).ok()).toBe(true);
    expect((await request.patch(`/api/jobs/${id}`, { headers, data: { _status: "published" } })).ok()).toBe(true);
    expect(await (await request.get("/sitemap.xml")).text()).toContain(`/join-us/careers/${slug}`);
    await Promise.all([page.goto(`/join-us/careers/${slug}`), listing.goto("/join-us/careers"), joinUs.goto("/join-us")]);
    await expect(page.getByRole("heading", { name: "Interested in this role?", exact: true })).toBeVisible();
    for (const tab of [listing, joinUs]) await expect(tab.getByRole("link", { name: "Browser deadline vacancy", exact: true })).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Applications are closed", exact: true })).toBeVisible({ timeout: 20000 });
    for (const tab of [listing, joinUs]) await expect(tab.getByRole("link", { name: "Browser deadline vacancy", exact: true })).toHaveCount(0, { timeout: 5000 });
    await expect(page.getByRole("button", { name: "Submit application", exact: true })).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
    expect(await (await request.get("/sitemap.xml")).text()).not.toContain(`/join-us/careers/${slug}`);
    expect(await (await request.get("/join-us/careers")).text()).not.toContain("Browser deadline vacancy");
    expect(await (await request.get("/join-us")).text()).not.toContain("Browser deadline vacancy");
  } finally {
    await Promise.all([listing.close(), joinUs.close()]);
    await request.patch(`/api/jobs/${id}`, { headers, data: { _status: "draft" } });
  }
});
