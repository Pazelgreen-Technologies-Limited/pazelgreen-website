import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";
import { once } from "node:events";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());
const testURL = process.env.TEST_DATABASE_URL;
if (!testURL || !new URL(testURL).pathname.endsWith("_test") || !["localhost", "127.0.0.1"].includes(new URL(testURL).hostname)) {
  throw new Error("HTTP checks require the disposable local TEST_DATABASE_URL and fixtures from pnpm test:integration.");
}
const base = "http://127.0.0.1:3101";
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3101"], {
  env: { ...process.env, APP_ENV: "test", SERVER_URL: base, PUBLIC_UPLOAD_DIR: path.resolve("storage/test-public"), PRIVATE_UPLOAD_DIR: path.resolve("storage/test-private") },
  windowsHide: true, stdio: ["ignore", "pipe", "pipe"],
});
let output = "";
server.stdout.on("data", (chunk: Buffer) => { output = (output + chunk.toString()).slice(-8000); });
server.stderr.on("data", (chunk: Buffer) => { output = (output + chunk.toString()).slice(-8000); });
async function api(route: string, token?: string, data?: object) {
  return fetch(new URL(route, base), { method: data ? "POST" : "GET", headers: {
    Origin: base, ...(token ? { Authorization: `JWT ${token}` } : {}), ...(data ? { "Content-Type": "application/json" } : {}),
  }, body: data ? JSON.stringify(data) : undefined, redirect: "follow" });
}
async function patch(route: string, token: string, data: object) {
  return fetch(new URL(route, base), { method: "PATCH", headers: { Origin: base, Authorization: `JWT ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(data) });
}
try {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null) throw new Error(`Local test server exited: ${output}`);
    const ready = await fetch(`${base}/api/media`).then(() => true).catch(() => false);
    if (ready) break;
    if (attempt === 99) throw new Error(`Local test server did not start: ${output}`);
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  for (const route of ["/", "/about", "/solutions", "/join-us", "/contact", "/admin/login", "/admin/accept-invitation", "/admin/create-first-user"]) {
    assert.equal((await api(route)).status, 200, route);
  }
  for (const route of ["/api/users", "/api/private-files", "/api/applications", "/api/hiring-history", "/api/faqs", "/api/faqs/1", "/api/faqs/versions", "/api/preview/media/1"]) assert.equal((await api(route)).status, 403, route);
  const announcementResponse = await api("/api/announcements/active");
  assert.equal(announcementResponse.headers.get("cache-control"), "no-store");
  const announcement = await announcementResponse.json();
  assert.equal(announcement.notice.message, "Approved company notice");
  assert.equal(announcement.notice.title, undefined);
  assert.equal(announcement.notice.publishedAt, undefined);
  const announcedPage = await (await api("/about")).text();
  assert.ok(announcedPage.includes("Approved company notice"));
  assert.ok(!announcedPage.includes("Private announcement replacement"));
  assert.equal((await api("/api/users/first-register", undefined, { email: "http-blocked@pazelgreen.test", name: "Blocked", password: "test-only-password-123", role: "admin" })).status, 403);
  assert.equal((await api("/api/invitations/accept", undefined, {})).status, 400);

  const password = "integration-only-passphrase-123";
  const initialLogin = await api("/api/users/login", undefined, { email: "initial-admin@pazelgreen.test", password });
  assert.equal(initialLogin.status, 200);
  const { token: initialToken, user: initialUser } = await initialLogin.json();
  assert.equal(initialUser.mustChangePassword, true);
  const initialHeaders = { Cookie: `payload-token=${initialToken}`, Origin: base, "Sec-Fetch-Site": "same-origin" };
  const adminRedirect = await fetch(`${base}/admin`, { headers: initialHeaders, redirect: "manual" });
  // Next can emit the redirect in streamed HTML once its layout has flushed.
  if (adminRedirect.status === 307) {
    assert.equal(adminRedirect.headers.get("location"), "/admin/change-initial-password");
  } else {
    assert.equal(adminRedirect.status, 200);
    assert.ok((await adminRedirect.text()).includes("NEXT_REDIRECT;replace;/admin/change-initial-password;307;"), "Initial admin must be redirected to password setup");
  }
  const passwordPage = await fetch(`${base}/admin/change-initial-password`, { headers: initialHeaders });
  assert.equal(passwordPage.status, 200);
  assert.ok((await passwordPage.text()).includes("Choose your own password"));
  assert.equal((await api("/api/private-files", initialToken)).status, 403);
  assert.equal((await api("/api/invitations", initialToken, { email: "initial-blocked@pazelgreen.test", name: "Blocked", role: "staff" })).status, 403);
  await patch(`/api/users/${initialUser.id}`, initialToken, { mustChangePassword: false });
  assert.equal((await (await api(`/api/users/${initialUser.id}`, initialToken)).json()).mustChangePassword, true);
  assert.equal((await patch(`/api/users/${initialUser.id}`, initialToken, { password })).status, 400);
  assert.equal((await patch(`/api/users/${initialUser.id}`, initialToken, { email: "changed-admin@pazelgreen.test", password: `${password}-changed` })).status, 200);
  assert.equal((await api("/api/private-files", initialToken)).status, 403, "Password change revokes the initial session");
  const changedLogin = await api("/api/users/login", undefined, { email: "changed-admin@pazelgreen.test", password: `${password}-changed` });
  assert.equal(changedLogin.status, 200);
  const changed = await changedLogin.json();
  assert.equal(changed.user.mustChangePassword, false);
  assert.equal((await api("/api/private-files", changed.token)).status, 200);
  const adminLogin = await api("/api/users/login", undefined, { email: "admin@pazelgreen.test", password });
  assert.equal(adminLogin.status, 200);
  const adminToken = (await adminLogin.json()).token as string;
  const staffLogin = await api("/api/users/login", undefined, { email: "staff@pazelgreen.test", password });
  assert.equal(staffLogin.status, 200);
  const { token: staffToken, user: staff } = await staffLogin.json();
  const careers = await (await api("/join-us/careers")).text();
  assert.ok(careers.includes("Approved careers listing SEO"));
  assert.ok(careers.includes("Field systems engineer"));
  for (const privateTitle of ["Private revised engineering vacancy", "Closed field coordinator", "Expired field researcher", "Private draft vacancy"]) assert.ok(!careers.includes(privateTitle), privateTitle);
  const joinUs = await (await api("/join-us")).text();
  assert.ok(joinUs.includes("Field systems engineer"));
  assert.ok(!joinUs.includes("Full Stack Engineers"));
  assert.ok(!joinUs.includes("Closed field coordinator"));
  const publicJob = (await (await api("/api/jobs?where[slug][equals]=field-systems-engineer")).json()).docs[0];
  assert.ok(publicJob.reference.startsWith("D-TE | DH-"));
  assert.equal(publicJob.reviewState, undefined);
  const jobHTML = await (await api("/join-us/careers/field-systems-engineer?preview=true", staffToken)).text();
  assert.ok(jobHTML.includes("Approved engineering opportunity"));
  assert.ok(jobHTML.includes("Build agricultural systems at Pazelgreen."));
  assert.ok(!jobHTML.includes("Private job SEO"));
  assert.ok(jobHTML.includes("Interested in this role?"));
  for (const slug of ["closed-vacancy", "expired-vacancy"]) {
    const html = await (await api(`/join-us/careers/${slug}`)).text();
    assert.ok(html.includes("Applications are closed"));
    assert.ok(!html.includes("Interested in this role?"));
  }
  for (const route of ["/join-us/careers/private-vacancy", "/join-us/careers/withdrawn-vacancy", "/join-us/careers/not-a-job", "/join-us/careers?page=0", "/join-us/careers?page=99999"]) {
    const response = await api(route);
    const html = await response.text();
    assert.ok([200, 404].includes(response.status));
    assert.ok(html.includes("Position or page not found"), route);
    assert.ok(html.includes("noindex"), route);
    assert.ok(!html.includes("Private draft vacancy"));
  }
  assert.equal((await api("/api/jobs/versions")).status, 403);
  assert.ok(!JSON.stringify(await (await api("/api/jobs?draft=true")).json()).includes("Private revised engineering vacancy"));
  assert.equal((await api("/api/annual-advert-counters", adminToken)).status, 403);
  assert.equal((await api("/api/departments", staffToken, { name: "Blocked", code: "NO" })).status, 403);
  assert.equal((await patch(`/api/jobs/${publicJob.id}`, staffToken, { _status: "published" })).status, 403);
  const anonJobPreview = await fetch(`${base}/join-us/careers/preview/${publicJob.id}`, { headers: { Origin: base }, redirect: "manual" });
  assert.equal(anonJobPreview.headers.get("X-Robots-Tag"), "noindex, nofollow");
  assert.ok(!(await anonJobPreview.text()).includes("Private revised engineering vacancy"));
  const jobPreview = await api(`/join-us/careers/preview/${publicJob.id}`, staffToken);
  assert.equal(jobPreview.headers.get("X-Robots-Tag"), "noindex, nofollow");
  assert.ok(jobPreview.headers.get("Cache-Control")?.includes("no-store"));
  assert.ok((await jobPreview.text()).includes("Private revised engineering vacancy"));
  const jobJSON = await api(`/api/preview/jobs/${publicJob.id}`, staffToken);
  assert.equal((await jobJSON.json()).title, "Private revised engineering vacancy");
  // Warmed pages must reflect approval and time-based expiry without rebuilding.
  async function publishJob(data: object) {
    assert.equal((await patch(`/api/jobs/${publicJob.id}`, staffToken, data)).status, 200);
    assert.equal((await patch(`/api/jobs/${publicJob.id}`, staffToken, { reviewState: "in-review" })).status, 200);
    assert.equal((await patch(`/api/jobs/${publicJob.id}`, adminToken, { _status: "published" })).status, 200);
    assert.equal((await (await api(`/api/jobs/${publicJob.id}`)).json()).reference, publicJob.reference);
  }
  await publishJob({ title: publicJob.title, seo: publicJob.seo, state: "closed" });
  assert.ok((await (await api("/join-us/careers")).text()).includes("No open positions right now"));
  assert.ok(!(await (await api("/join-us")).text()).includes("Field systems engineer"));
  const deadline = new Date(Date.now() + 10000);
  await publishJob({ state: "open", deadline: deadline.toISOString() });
  assert.ok((await (await api("/join-us/careers")).text()).includes("Field systems engineer"));
  await new Promise(resolve => setTimeout(resolve, Math.max(0, deadline.getTime() - Date.now() + 100)));
  assert.ok((await (await api("/join-us/careers")).text()).includes("No open positions right now"));
  assert.ok((await (await api("/join-us/careers/field-systems-engineer")).text()).includes("Applications are closed"));
  assert.ok(!(await (await api("/join-us")).text()).includes("Field systems engineer"));
  await publishJob({ state: "open", deadline: null });
  assert.ok((await (await api("/join-us/careers")).text()).includes("Field systems engineer"));
  await patch(`/api/jobs/${publicJob.id}`, staffToken, { title: "Private revised engineering vacancy", state: "closed", seo: { title: "Private job SEO" } });
  const blog = await (await api("/blog")).text();
  assert.ok(blog.includes("News &amp; insights"));
  assert.ok(blog.includes("Field notes: stronger food systems"));
  assert.ok(!blog.includes("Private revised field notes"));
  assert.ok(!blog.includes("Private draft-only story"));
  const pageTwo = await (await api("/blog?page=2")).text();
  assert.ok(pageTwo.includes("Field report 1"));
  assert.ok(!pageTwo.includes("Field notes: stronger food systems"));
  assert.ok((await (await api("/blog?category=company-updates")).text()).includes("No articles in this category yet"));
  assert.ok((await (await api("/blog?category=food-systems&page=2")).text()).includes("Field report 1"));
  for (const route of ["/blog?page=0", "/blog?page=9999", "/blog?category=missing-category", "/blog/not-a-real-story", "/blog/draft-only-story", "/blog/withdrawn-story"]) {
    const response = await api(route);
    const html = await response.text();
    assert.ok([200, 404].includes(response.status), route);
    assert.ok(html.includes("Article or page not found"), route);
    assert.ok(html.includes("noindex"), route);
    assert.ok(!html.includes("Private draft-only story"), route);
  }
  const publicPost = (await (await api("/api/posts?where[slug][equals]=field-notes")).json()).docs[0];
  assert.equal(publicPost.title, "Field notes: stronger food systems");
  assert.equal(publicPost.reviewNote, undefined);
  assert.ok(!JSON.stringify(await (await api("/api/posts?draft=true")).json()).includes("Private revised field notes"));
  assert.equal((await api("/api/posts/versions")).status, 403);
  const articleHTML = await (await api("/blog/field-notes?preview=true", staffToken)).text();
  assert.ok(articleHTML.includes("Approved field notes SEO"));
  assert.ok(articleHTML.includes("Approved field notes description."));
  assert.ok(articleHTML.includes("Approved article body about connected agricultural systems."));
  assert.ok(!articleHTML.includes("Private replacement article body."));
  assert.ok(articleHTML.includes("blog-fields"));
  const anonymousPreview = await fetch(`${base}/blog/preview/${publicPost.id}`, { headers: { Origin: base }, redirect: "manual" });
  assert.equal(anonymousPreview.headers.get("X-Robots-Tag"), "noindex, nofollow");
  assert.ok(!(await anonymousPreview.text()).includes("Private revised field notes"));
  const draftPreview = await api(`/blog/preview/${publicPost.id}`, staffToken);
  assert.equal(draftPreview.status, 200);
  assert.equal(draftPreview.headers.get("X-Robots-Tag"), "noindex, nofollow");
  assert.ok(draftPreview.headers.get("Cache-Control")?.includes("no-store"));
  assert.ok((await draftPreview.text()).includes("Private revised field notes"));
  const jsonPreview = await api(`/api/preview/posts/${publicPost.id}`, staffToken);
  assert.equal(jsonPreview.status, 200);
  assert.equal((await jsonPreview.json()).title, "Private revised field notes");
  assert.equal((await api(`/api/preview/posts/${publicPost.id}`)).status, 403);
  assert.equal((await patch(`/api/posts/${publicPost.id}`, staffToken, { _status: "published" })).status, 403);
  const publishedCompany = await api("/api/globals/company-settings");
  assert.equal(publishedCompany.status, 200);
  const company = await publishedCompany.json();
  assert.equal(company.email, "public-company@pazelgreen.test");
  assert.equal(company.reviewNote, undefined);
  assert.equal((await api("/api/globals/company-settings?draft=true")).status, 403);
  assert.equal((await api("/api/globals/page-seo?draft=true")).status, 403);
  assert.equal((await api("/api/globals/company-settings/versions")).status, 403);
  assert.equal((await api("/api/globals/company-settings", undefined, { email: "blocked@pazelgreen.test" })).status, 403);
  assert.equal((await api("/api/globals/page-seo", staffToken, { _status: "published" })).status, 403);
  const homepage = await (await api("/")).text();
  assert.ok(homepage.includes("Approved homepage title"));
  assert.ok(homepage.includes("Approved homepage description"));
  assert.ok(!homepage.includes("Private draft homepage title"));
  const contactPage = await (await api("/contact")).text();
  assert.ok(contactPage.includes("Approved contact title"));
  assert.ok(contactPage.includes("public-company@pazelgreen.test"));
  assert.ok(contactPage.includes("https://example.com/company"));
  assert.ok(contactPage.includes("Working hours ("));
  assert.ok(!contactPage.includes("private-draft@pazelgreen.test"));
  // Warm pages first, then prove approved updates appear without another build.
  assert.equal((await api("/api/globals/company-settings", staffToken, { email: "updated-company@pazelgreen.test" })).status, 200);
  assert.equal((await api("/api/globals/company-settings", staffToken, { reviewState: "in-review" })).status, 200);
  assert.equal((await api("/api/globals/company-settings", adminToken, { _status: "published" })).status, 200);
  assert.ok((await (await api("/contact")).text()).includes("updated-company@pazelgreen.test"));
  assert.ok((await (await api("/about")).text()).includes("updated-company@pazelgreen.test"));
  assert.equal((await api("/api/globals/page-seo", staffToken, { home: { title: "Updated homepage title", description: "Updated homepage description" } })).status, 200);
  assert.equal((await api("/api/globals/page-seo", staffToken, { reviewState: "in-review" })).status, 200);
  assert.equal((await api("/api/globals/page-seo", adminToken, { _status: "published" })).status, 200);
  assert.ok((await (await api("/")).text()).includes("Updated homepage title"));
  assert.equal((await api("/api/invitations", staffToken, { email: "blocked@pazelgreen.test", name: "Blocked", role: "admin" })).status, 403);
  await patch(`/api/users/${staff.id}`, staffToken, { role: "admin" });
  assert.equal((await (await api(`/api/users/${staff.id}`, adminToken)).json()).role, "staff");

  const media = (await (await api("/api/media?draft=true&limit=1", staffToken)).json()).docs[0];
  assert.ok(media, "Integration media fixture is required.");
  assert.equal((await patch(`/api/media/${media.id}`, staffToken, { _status: "published" })).status, 403);
  assert.equal((await patch(`/api/media/${media.id}`, staffToken, { alt: "HTTP approved image" })).status, 200);
  assert.equal((await patch(`/api/media/${media.id}`, staffToken, { reviewState: "in-review" })).status, 200);
  assert.equal((await patch(`/api/media/${media.id}`, adminToken, { _status: "published" })).status, 200);
  assert.equal((await (await api(`/api/media/${media.id}`)).json()).alt, "HTTP approved image");
  assert.equal((await patch(`/api/media/${media.id}`, staffToken, { alt: "HTTP unapproved replacement" })).status, 200);
  const live = await (await api(`/api/media/${media.id}`)).json();
  assert.equal(live.alt, "HTTP approved image");
  assert.equal(live.reviewNote, undefined);
  const preview = await api(`/api/preview/media/${media.id}`, staffToken);
  assert.equal(preview.headers.get("cache-control"), "private, no-store");
  assert.equal((await preview.json()).alt, "HTTP unapproved replacement");

  const file = (await (await api("/api/private-files?limit=1", staffToken)).json()).docs[0];
  assert.ok(file, "Integration private-file fixture is required.");
  const downloadPath = `/api/private-files/file/${encodeURIComponent(file.filename)}`;
  assert.equal((await api(downloadPath)).status, 403);
  const download = await api(downloadPath, staffToken);
  assert.equal(download.status, 200);
  assert.equal(download.headers.get("cache-control"), "private, no-store");
  assert.ok((await download.text()).startsWith("%PDF-"));

  assert.equal((await patch(`/api/users/${staff.id}`, adminToken, { active: false })).status, 200);
  assert.equal((await api(downloadPath, staffToken)).status, 403, "Deactivation must invalidate an existing session.");
  assert.equal((await patch(`/api/users/${staff.id}`, adminToken, { active: true })).status, 200);
  console.info("HTTP smoke checks passed: public/admin routes, registration denial, role enforcement, publication, preview, private downloads and session revocation.");
} finally {
  server.kill();
  if (server.exitCode === null) await once(server, "exit");
}
