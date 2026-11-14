import path from "node:path";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import nextEnv from "@next/env";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { createLocalReq, getPayload, type Payload, type PayloadRequest } from "payload";
import { sql } from "@payloadcms/db-postgres";
import type { Category, Department, EmploymentType, Job, Media, PositionCode, Post, User } from "../../payload-types";
import { advertYear, openJobsWhere } from "../../cms/career-rules";
import { hashInvitation, Invitations } from "../../cms/invitations";
import { previewEndpoint } from "../../cms/preview";
import { ensureFirstAdmin } from "../../cms/bootstrap";
import { isAdmin } from "../../cms/access";

let payload: Payload;
let admin: User;
let staff: User;
let bootstrapResults: { code: number; output: string }[];
const password = "integration-only-passphrase-123";
const image = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/f9sAAAAASUVORK5CYII=", "base64");
const asUser = (user: User) => ({ ...user, collection: "users" as const });

async function createAccount(email: string, role: "admin" | "staff") {
  return payload.create({ collection: "users", data: { email, name: role, role, active: true, password }, overrideAccess: true, context: { acceptInvitation: true } });
}

async function request(user?: User): Promise<PayloadRequest> {
  return createLocalReq({ user: user ? asUser(user) : undefined }, payload);
}

function bootstrap() {
  return new Promise<{ code: number; output: string }>((resolve, reject) => {
    const child = spawn(process.execPath, ["--import", "tsx", "scripts/bootstrap-admin.ts"], {
      env: { ...process.env, BOOTSTRAP_ADMIN_EMAIL: "admin@pazelgreen.test", BOOTSTRAP_ADMIN_PASSWORD: `${password}-initial` },
      windowsHide: true, timeout: 30000, stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    child.stdout.on("data", (chunk: Buffer) => { output += chunk.toString(); });
    child.stderr.on("data", (chunk: Buffer) => { output += chunk.toString(); });
    child.on("error", reject);
    child.on("close", (code) => resolve({ code: code ?? 1, output }));
  });
}

beforeAll(async () => {
  nextEnv.loadEnvConfig(process.cwd());
  const testURL = process.env.TEST_DATABASE_URL;
  if (!testURL || !new URL(testURL).pathname.endsWith("_test") || !["127.0.0.1", "localhost"].includes(new URL(testURL).hostname)) {
    throw new Error("Integration tests require a local TEST_DATABASE_URL whose database name ends in _test.");
  }
  process.env.APP_ENV = "test";
  process.env.PUBLIC_UPLOAD_DIR = path.resolve("storage/test-public");
  process.env.PRIVATE_UPLOAD_DIR = path.resolve("storage/test-private");
  const { default: config } = await import("../../payload.config");
  payload = await getPayload({ config });
  await payload.db.migrate();
  // Only this verified disposable local test database is reset; migrations remain.
  await payload.db.drizzle.execute(sql`TRUNCATE users, invitations, audit_events, media, private_files, company_settings, _company_settings_v, page_seo, _page_seo_v, posts, _posts_v, categories, _categories_v, employment_types, _employment_types_v, departments, _departments_v, position_codes, _position_codes_v, jobs, _jobs_v, annual_advert_counters RESTART IDENTITY CASCADE`);
  await expect(ensureFirstAdmin(payload, {})).rejects.toThrow("No administrator exists");
  await expect(ensureFirstAdmin(payload, { BOOTSTRAP_ADMIN_EMAIL: "first@pazelgreen.test", BOOTSTRAP_ADMIN_PASSWORD: "short" })).rejects.toThrow("12–256");
  const conflict = await createAccount("conflict@pazelgreen.test", "staff");
  await expect(ensureFirstAdmin(payload, { BOOTSTRAP_ADMIN_EMAIL: conflict.email, BOOTSTRAP_ADMIN_PASSWORD: password })).rejects.toThrow("never promoted");
  await payload.delete({ collection: "users", id: conflict.id, overrideAccess: true });
  bootstrapResults = await Promise.all([bootstrap(), bootstrap()]);
  admin = (await payload.find({ collection: "users", overrideAccess: true, where: { email: { equals: "admin@pazelgreen.test" } } })).docs[0];
  if (!admin) throw new Error("CLI bootstrap did not create the fixture administrator.");
  // Exercise the mandatory password change before using this admin in other tests.
  expect(admin.mustChangePassword).toBe(true);
  expect(isAdmin(asUser(admin))).toBe(false);
  await expect(payload.create({ collection: "invitations", data: { email: "blocked@pazelgreen.test", name: "Blocked", role: "staff" }, overrideAccess: false, user: asUser(admin) })).rejects.toThrow();
  const attemptedBypass = await payload.update({ collection: "users", id: admin.id, data: { mustChangePassword: false }, overrideAccess: false, user: asUser(admin) });
  expect(attemptedBypass.mustChangePassword).toBe(true);
  await expect(payload.update({ collection: "users", id: admin.id, data: { password: "short" }, overrideAccess: false, user: asUser(admin) })).rejects.toThrow();
  await expect(payload.update({ collection: "users", id: admin.id, data: { password: `${password}-initial` }, overrideAccess: false, user: asUser(admin) })).rejects.toThrow("different");
  const initialLogin = await payload.login({ collection: "users", data: { email: admin.email, password: `${password}-initial` } });
  const authHeaders = new Headers({ Authorization: `JWT ${initialLogin.token}` });
  const initialSession = await payload.auth({ headers: authHeaders });
  admin = await payload.update({ collection: "users", id: admin.id, data: { password }, overrideAccess: false, user: initialSession.user! });
  expect(admin.mustChangePassword).toBe(false);
  expect((await payload.auth({ headers: authHeaders })).user).toBeNull();
  staff = await createAccount("staff@pazelgreen.test", "staff");
});

afterAll(async () => {
  if (!payload) return;
  try {
    // HTTP tests exercise this account's first-login redirect and API restrictions.
    await payload.create({ collection: "users", data: { email: "initial-admin@pazelgreen.test", name: "Initial admin", role: "admin", active: true, password, mustChangePassword: true }, overrideAccess: true, context: { bootstrapAdmin: true } });
  } finally { await payload.destroy(); }
});

describe("accounts and access", () => {
  it("bootstraps only one first admin across simultaneous CLI processes", () => {
    expect(bootstrapResults.map((result) => result.code), JSON.stringify(bootstrapResults)).toEqual([0, 0]);
    expect(bootstrapResults.filter((result) => result.output.includes("First administrator created"))).toHaveLength(1);
    expect(bootstrapResults.filter((result) => result.output.includes("Administrator already exists"))).toHaveLength(1);
  });
  it("skips existing admins without requiring bootstrap secrets or resetting credentials", async () => {
    expect(await ensureFirstAdmin(payload, {})).toBe(false);
    expect(await ensureFirstAdmin(payload, { BOOTSTRAP_ADMIN_EMAIL: "replacement@pazelgreen.test", BOOTSTRAP_ADMIN_PASSWORD: "different-password-123" })).toBe(false);
    const unchanged = await payload.findByID({ collection: "users", id: admin.id });
    expect(unchanged.email).toBe(admin.email);
    expect(unchanged.mustChangePassword).toBe(false);
    await expect(payload.login({ collection: "users", data: { email: admin.email, password } })).resolves.toHaveProperty("token");
  });
  it("refuses public signup even when a caller tries to bypass access", async () => {
    await expect(payload.create({ collection: "users", data: { email: "attacker@pazelgreen.test", name: "No", password, role: "admin" }, overrideAccess: true })).rejects.toThrow("invitation");
    await expect(payload.find({ collection: "users", overrideAccess: false })).rejects.toMatchObject({ status: 403 });
  });
  it("staff cannot create or delete users or create invitations", async () => {
    await expect(payload.create({ collection: "users", data: { email: "no@pazelgreen.test", name: "No", role: "staff", password }, overrideAccess: false, user: asUser(staff) })).rejects.toThrow();
    await expect(payload.delete({ collection: "users", id: admin.id, overrideAccess: false, user: asUser(staff) })).rejects.toThrow();
    await expect(payload.create({ collection: "invitations", data: { email: "no@pazelgreen.test", name: "No", role: "staff" }, overrideAccess: false, user: asUser(staff) })).rejects.toThrow();
  });
  it("allows own profile edits but prevents role escalation and other-user changes", async () => {
    const changed = await payload.update({ collection: "users", id: staff.id, data: { name: "Updated profile" }, overrideAccess: false, user: asUser(staff) });
    expect(changed.name).toBe("Updated profile");
    await payload.update({ collection: "users", id: staff.id, data: { role: "admin" }, overrideAccess: false, user: asUser(staff) }).catch(() => undefined);
    const unchanged = await payload.findByID({ collection: "users", id: staff.id, overrideAccess: true });
    expect(unchanged.role).toBe("staff");
    await expect(payload.update({ collection: "users", id: admin.id, data: { name: "Changed" }, overrideAccess: false, user: asUser(staff) })).rejects.toThrow();
  });
  it("protects the last admin against demotion, deactivation and deletion", async () => {
    for (const data of [{ active: false }, { role: "staff" as const }]) {
      await expect(payload.update({ collection: "users", id: admin.id, data, overrideAccess: false, user: asUser(admin) })).rejects.toThrow("final active");
    }
    await expect(payload.delete({ collection: "users", id: admin.id, overrideAccess: false, user: asUser(admin) })).rejects.toThrow("final active");
  });
  it("preserves at least one active admin under concurrent database updates", async () => {
    const second = await createAccount("second-admin@pazelgreen.test", "admin");
    const results = await Promise.allSettled([
      payload.db.pool.query("UPDATE users SET active = false WHERE id = $1", [admin.id]),
      payload.db.pool.query("UPDATE users SET active = false WHERE id = $1", [second.id]),
    ]);
    expect(results.filter((r) => r.status === "rejected")).toHaveLength(1);
    const remaining = await payload.count({ collection: "users", overrideAccess: true, where: { and: [{ active: { equals: true } }, { role: { equals: "admin" } }] } });
    expect(remaining.totalDocs).toBe(1);
    // Restore the test fixture admin, then remove the other account.
    await payload.db.pool.query("UPDATE users SET active = true WHERE id = $1", [admin.id]);
    await payload.delete({ collection: "users", id: second.id, user: asUser(admin), overrideAccess: false });
  });
  it("denies login and operations for inactive staff", async () => {
    const disabled = await payload.update({ collection: "users", id: staff.id, data: { active: false }, overrideAccess: false, user: asUser(admin) });
    await expect(payload.login({ collection: "users", data: { email: staff.email, password } })).rejects.toThrow("inactive");
    await expect(payload.find({ collection: "private-files", user: asUser(disabled), overrideAccess: false })).rejects.toMatchObject({ status: 403 });
    await payload.update({ collection: "users", id: staff.id, data: { active: true }, overrideAccess: false, user: asUser(admin) });
  });
});

describe("invitations", () => {
  const accept = Invitations.endpoints && Invitations.endpoints[0].handler;
  async function redeem(token: string) {
    const req = await request();
    req.json = async () => ({ token, password });
    if (!accept) throw new Error("Invitation endpoint missing.");
    return accept(req);
  }
  it("returns a recoverable error for malformed JSON and weak activation passwords", async () => {
    if (!accept) throw new Error("Invitation endpoint missing.");
    const malformed = await request();
    malformed.json = async () => { throw new SyntaxError("Invalid JSON"); };
    expect((await accept(malformed)).status).toBe(400);
    const weak = await request();
    weak.json = async () => ({ token: "a".repeat(64), password: "short" });
    expect((await accept(weak)).status).toBe(400);
  });
  it("emails expiring single-use links and serializes simultaneous redemption", async () => {
    const invitation = await payload.create({ collection: "invitations", data: { email: "invitee@pazelgreen.test", name: "Invitee", role: "staff" }, overrideAccess: false, user: asUser(admin) });
    expect(invitation.tokenHash).toBeUndefined();
    const messages = await (await fetch("http://127.0.0.1:8025/api/v1/messages")).json();
    const message = messages.messages.find((item: { To: { Address: string }[] }) => item.To.some((to) => to.Address === "invitee@pazelgreen.test"));
    expect(message).toBeDefined();
    const email = await (await fetch(`http://127.0.0.1:8025/api/v1/message/${message.ID}`)).json();
    const token = new URL(email.Text.match(/http[^\s]+/)[0]).searchParams.get("token")!;
    const stored = await payload.findByID({ collection: "invitations", id: invitation.id, overrideAccess: true, showHiddenFields: true });
    // The raw activation token is never stored in the database.
    const row = await payload.db.pool.query("SELECT token_hash FROM invitations WHERE id = $1", [stored.id]);
    expect(row.rows[0].token_hash).toBe(hashInvitation(token));
    const responses = await Promise.all([redeem(token), redeem(token)]);
    expect(responses.map((response) => response.status).sort()).toEqual([201, 400]);
    expect((await payload.count({ collection: "users", where: { email: { equals: "invitee@pazelgreen.test" } }, overrideAccess: true })).totalDocs).toBe(1);
    expect((await redeem(token)).status).toBe(400);
    await expect(payload.login({ collection: "users", data: { email: "invitee@pazelgreen.test", password } })).resolves.toHaveProperty("token");
  });
  it("rejects expired invitations without creating accounts", async () => {
    const token = "a".repeat(64);
    await payload.db.pool.query("INSERT INTO invitations (email, name, role, token_hash, expires_at, invited_by) VALUES ($1, $2, $3, $4, $5, $6)", ["expired@pazelgreen.test", "Expired", "staff", hashInvitation(token), new Date(Date.now() - 1000), String(admin.id)]);
    expect((await redeem(token)).status).toBe(400);
  });
});

describe("review, publication and private files", () => {
  let mediaID: number;
  it("keeps a new staff draft private and prevents publishing", async () => {
    const draft = await payload.create({ collection: "media", data: { alt: "First draft", reviewState: "draft" }, file: { name: "test.png", mimetype: "image/png", size: image.length, data: image }, user: asUser(staff), overrideAccess: false });
    mediaID = draft.id;
    expect(draft.reviewState).toBe("draft");
    expect((await payload.find({ collection: "media", overrideAccess: false })).docs).toHaveLength(0);
    expect((await payload.find({ collection: "media", draft: true, overrideAccess: false })).docs).toHaveLength(0);
    await expect(payload.update({ collection: "media", id: mediaID, data: { _status: "published" }, user: asUser(staff), overrideAccess: false })).rejects.toThrow("administrators");
  });
  it("requires review, then allows admin publication with attribution", async () => {
    await expect(payload.update({ collection: "media", id: mediaID, data: { _status: "published" }, user: asUser(admin), overrideAccess: false })).rejects.toThrow("submitted for review");
    await payload.update({ collection: "media", id: mediaID, data: { reviewState: "in-review" }, user: asUser(staff), overrideAccess: false });
    const published = await payload.update({ collection: "media", id: mediaID, data: { _status: "published" }, user: asUser(admin), overrideAccess: false });
    expect(published.reviewState).toBe("published");
    expect(published.publishedBy).toBe(String(admin.id));
    expect((await payload.findByID({ collection: "media", id: mediaID, overrideAccess: false })).alt).toBe("First draft");
  });
  it("preserves live content even when staff omit draft=true", async () => {
    await payload.update({ collection: "media", id: mediaID, data: { alt: "Unapproved replacement", publishedBy: "forged" }, user: asUser(staff), overrideAccess: false });
    const live = await payload.findByID({ collection: "media", id: mediaID, overrideAccess: false });
    expect(live.alt).toBe("First draft");
    expect(live.publishedBy).toBeUndefined();
    expect(live.reviewNote).toBeUndefined();
    const latest = await payload.findByID({ collection: "media", id: mediaID, draft: true, user: asUser(staff), overrideAccess: false });
    expect(latest.alt).toBe("Unapproved replacement");
    expect(latest.reviewState).toBe("draft");
    expect(latest.publishedBy).toBe(String(admin.id));
  });
  it("invalidates pending review when content is edited", async () => {
    await payload.update({ collection: "media", id: mediaID, data: { reviewState: "in-review" }, user: asUser(staff), overrideAccess: false });
    const edited = await payload.update({ collection: "media", id: mediaID, data: { alt: "Edited after submission", reviewState: "in-review" }, user: asUser(staff), overrideAccess: false });
    expect(edited.reviewState).toBe("draft");
    await expect(payload.update({ collection: "media", id: mediaID, data: { _status: "published" }, user: asUser(admin), overrideAccess: false })).rejects.toThrow();
    await expect(payload.update({ collection: "media", id: mediaID, data: { reviewState: "changes-requested" }, user: asUser(admin), overrideAccess: false })).rejects.toThrow("note");
    const returned = await payload.update({ collection: "media", id: mediaID, data: { reviewState: "changes-requested", reviewNote: "Please revise the alt text." }, user: asUser(admin), overrideAccess: false });
    expect(returned.reviewState).toBe("changes-requested");
  });
  it("authenticates previews and protects version history", async () => {
    const anonymous = await request(); anonymous.routeParams = { collection: "media", id: String(mediaID) };
    expect((await previewEndpoint.handler(anonymous)).status).toBe(403);
    const editor = await request(staff); editor.routeParams = anonymous.routeParams;
    const preview = await previewEndpoint.handler(editor);
    expect(preview.status).toBe(200);
    expect(preview.headers.get("Cache-Control")).toBe("private, no-store");
    expect((await preview.json()).alt).toBe("Edited after submission");
    await expect(payload.findVersions({ collection: "media", overrideAccess: false })).rejects.toThrow();
    expect((await payload.findVersions({ collection: "media", user: asUser(staff), overrideAccess: false })).totalDocs).toBeGreaterThan(0);
  });
  it("requires a fresh review for edits supplied during publication", async () => {
    await payload.update({ collection: "media", id: mediaID, data: { reviewState: "in-review" }, user: asUser(staff), overrideAccess: false });
    await expect(payload.update({ collection: "media", id: mediaID, data: { _status: "published", alt: "Changed during approval" }, user: asUser(admin), overrideAccess: false })).rejects.toThrow("unchanged draft");
    const anonymousDraft = await payload.find({ collection: "media", draft: true, overrideAccess: false });
    expect(anonymousDraft.docs.every((doc) => doc.alt !== "Edited after submission")).toBe(true);
    const versions = await payload.findVersions({ collection: "media", user: asUser(staff), overrideAccess: false });
    await expect(payload.restoreVersion({ collection: "media", id: versions.docs[0].id, user: asUser(staff), overrideAccess: false })).rejects.toThrow("new draft");
  });
  it("lets admins archive public content by unpublishing while retaining history", async () => {
    await payload.update({ collection: "media", id: mediaID, data: { _status: "draft" }, user: asUser(staff), overrideAccess: false });
    expect((await payload.findByID({ collection: "media", id: mediaID, overrideAccess: false })).alt).toBe("First draft");
    await payload.update({ collection: "media", id: mediaID, data: { _status: "draft" }, user: asUser(admin), overrideAccess: false });
    await expect(payload.findByID({ collection: "media", id: mediaID, overrideAccess: false })).rejects.toThrow();
    expect((await payload.findVersions({ collection: "media", user: asUser(admin), overrideAccess: false })).totalDocs).toBeGreaterThan(1);
  });
  it("denies public private-file enumeration and enforces download access", async () => {
    const objects = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 100 100] >>"];
    let document = "%PDF-1.4\n";
    const offsets: number[] = [0];
    for (const [index, object] of objects.entries()) { offsets.push(Buffer.byteLength(document)); document += `${index + 1} 0 obj\n${object}\nendobj\n`; }
    const xref = Buffer.byteLength(document);
    document += `xref\n0 4\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
    const bytes = Buffer.from(document);
    const file = await payload.create({ collection: "private-files", data: {}, file: { name: "private.pdf", mimetype: "application/pdf", size: bytes.length, data: bytes }, user: asUser(admin), overrideAccess: false });
    await expect(payload.find({ collection: "private-files", overrideAccess: false })).rejects.toMatchObject({ status: 403 });
    await expect(payload.findByID({ collection: "private-files", id: file.id, overrideAccess: false })).rejects.toThrow();
    // Exercise Payload's actual file handler, not just the document read rule.
    const upload = payload.collections["private-files"].config.endpoints;
    const handler = upload && upload.find((endpoint) => endpoint.path.includes(":filename"));
    expect(handler).toBeDefined();
    if (!handler) throw new Error("Private file handler is missing.");
    const req = await request(); req.routeParams = { collection: "private-files", filename: file.filename! };
    await expect(handler.handler(req)).rejects.toMatchObject({ status: 403 });
    const authorized = await request(staff); authorized.routeParams = req.routeParams;
    const download = await handler!.handler(authorized);
    expect(download.status).toBe(200);
    expect(download.headers.get("Cache-Control")).toBe("private, no-store");
    expect(Buffer.from(await download.arrayBuffer())).toEqual(bytes);
  });
  it("retains audit attribution after an account is deleted", async () => {
    const removed = await createAccount("temporary@pazelgreen.test", "staff");
    await payload.delete({ collection: "users", id: removed.id, user: asUser(admin), overrideAccess: false });
    const audit = await payload.find({ collection: "audit-events", user: asUser(admin), overrideAccess: false, where: { subject: { equals: `users:${removed.id}` } } });
    expect(audit.totalDocs).toBeGreaterThanOrEqual(2);
    expect(audit.docs.every((entry) => typeof entry.actor === "string")).toBe(true);
    await expect(payload.find({ collection: "audit-events", user: asUser(staff), overrideAccess: false })).rejects.toMatchObject({ status: 403 });
  });
});


describe("company settings and page SEO review", () => {
  it("keeps first drafts private and rejects anonymous edits and staff publication", async () => {
    await expect(payload.updateGlobal({ slug: "company-settings", data: { email: "blocked@pazelgreen.test" }, overrideAccess: false })).rejects.toThrow();
    await payload.updateGlobal({ slug: "company-settings", data: { email: "public-company@pazelgreen.test", phone: "+234 800 000 0000", address: "Test office", departmentContacts: [{ label: "Partnerships", email: "partners@pazelgreen.test" }], workingHours: [{ day: "monday", opens: "09:00", closes: "17:00" }, { day: "sunday", closed: true }], socialLinks: [{ platform: "linkedin", label: "LinkedIn", url: "https://example.com/company" }] }, overrideAccess: false, user: asUser(staff) });
    const publicDraft = await payload.findGlobal({ slug: "company-settings", overrideAccess: false });
    expect(publicDraft.email).toBeUndefined();
    await expect(payload.findGlobal({ slug: "company-settings", draft: true, overrideAccess: false })).rejects.toMatchObject({ status: 403 });
    await expect(payload.updateGlobal({ slug: "company-settings", data: { _status: "published" }, overrideAccess: false, user: asUser(staff) })).rejects.toMatchObject({ status: 403 });
    await expect(payload.updateGlobal({ slug: "company-settings", data: { _status: "published" }, overrideAccess: false, user: asUser(admin) })).rejects.toMatchObject({ status: 409 });
  });
  it("publishes unchanged reviewed settings and preserves live values during edits", async () => {
    await payload.updateGlobal({ slug: "company-settings", data: { reviewState: "in-review" }, overrideAccess: false, user: asUser(staff) });
    await payload.updateGlobal({ slug: "company-settings", data: { _status: "published" }, overrideAccess: false, user: asUser(admin) });
    const published = await payload.findGlobal({ slug: "company-settings", overrideAccess: false });
    expect(published.email).toBe("public-company@pazelgreen.test");
    expect(published.reviewState).toBeUndefined();
    expect(published.modifiedBy).toBeUndefined();
    await payload.updateGlobal({ slug: "company-settings", data: { email: "private-draft@pazelgreen.test" }, overrideAccess: false, user: asUser(staff) });
    expect((await payload.findGlobal({ slug: "company-settings", overrideAccess: false })).email).toBe(published.email);
    expect((await payload.findGlobal({ slug: "company-settings", draft: true, overrideAccess: false, user: asUser(staff) })).email).toBe("private-draft@pazelgreen.test");
  });
  it("invalidates approval on edits and requires an admin note when returning changes", async () => {
    await payload.updateGlobal({ slug: "company-settings", data: { reviewState: "in-review" }, overrideAccess: false, user: asUser(staff) });
    const changed = await payload.updateGlobal({ slug: "company-settings", data: { phone: "+234 800 000 0001" }, overrideAccess: false, user: asUser(staff) });
    expect(changed.reviewState).toBe("draft");
    await expect(payload.updateGlobal({ slug: "company-settings", data: { _status: "published" }, overrideAccess: false, user: asUser(admin) })).rejects.toMatchObject({ status: 409 });
    await expect(payload.updateGlobal({ slug: "company-settings", data: { reviewState: "changes-requested" }, overrideAccess: false, user: asUser(staff) })).rejects.toMatchObject({ status: 403 });
    await expect(payload.updateGlobal({ slug: "company-settings", data: { reviewState: "changes-requested" }, overrideAccess: false, user: asUser(admin) })).rejects.toMatchObject({ status: 400 });
    const returned = await payload.updateGlobal({ slug: "company-settings", data: { reviewState: "changes-requested", reviewNote: "Verify the public contact details." }, overrideAccess: false, user: asUser(admin) });
    expect(returned.reviewState).toBe("changes-requested");
    expect((await payload.findGlobal({ slug: "company-settings", overrideAccess: false })).reviewNote).toBeUndefined();
    const corrected = await payload.updateGlobal({ slug: "company-settings", data: { address: "Corrected test office" }, draft: true, overrideAccess: false, user: asUser(staff) });
    expect(corrected.reviewState).toBe("draft");
    await expect(payload.findGlobalVersions({ slug: "company-settings", overrideAccess: false })).rejects.toThrow();
  });
  it("reviews page metadata independently while keeping replacement SEO private", async () => {
    await payload.updateGlobal({ slug: "page-seo", data: { home: { title: "Approved homepage title", description: "Approved homepage description" }, contact: { title: "Approved contact title", description: "Approved contact description" } }, overrideAccess: false, user: asUser(staff) });
    await expect(payload.updateGlobal({ slug: "page-seo", data: { _status: "published" }, overrideAccess: false, user: asUser(staff) })).rejects.toMatchObject({ status: 403 });
    expect((await payload.findGlobal({ slug: "page-seo", overrideAccess: false })).home?.title).toBeFalsy();
    await payload.updateGlobal({ slug: "page-seo", data: { reviewState: "in-review" }, overrideAccess: false, user: asUser(staff) });
    await payload.updateGlobal({ slug: "page-seo", data: { _status: "published" }, overrideAccess: false, user: asUser(admin) });
    await payload.updateGlobal({ slug: "page-seo", data: { home: { title: "Private draft homepage title" } }, overrideAccess: false, user: asUser(staff) });
    expect((await payload.findGlobal({ slug: "page-seo", overrideAccess: false })).home?.title).toBe("Approved homepage title");
    await expect(payload.findGlobal({ slug: "page-seo", draft: true, overrideAccess: false })).rejects.toMatchObject({ status: 403 });
  });
  it("rejects unsafe social URLs and invalid business hours at publication", async () => {
    for (const invalid of [
      { socialLinks: [{ platform: "other" as const, label: "Unsafe", url: "javascript:alert(1)" }] },
      { workingHours: [{ day: "monday" as const, opens: "18:00", closes: "09:00" }] },
      { workingHours: [{ day: "sunday" as const, closed: true }, { day: "sunday" as const, closed: true }] },
      { timezone: "Invalid/Timezone" },
    ]) {
      await payload.updateGlobal({ slug: "company-settings", data: invalid, draft: true, overrideAccess: false, user: asUser(staff) });
      await payload.updateGlobal({ slug: "company-settings", data: { reviewState: "in-review" }, draft: true, overrideAccess: false, user: asUser(staff) });
      await expect(payload.updateGlobal({ slug: "company-settings", data: { _status: "published" }, overrideAccess: false, user: asUser(admin) })).rejects.toThrow();
      await payload.updateGlobal({ slug: "company-settings", data: { timezone: "Africa/Lagos", socialLinks: [{ platform: "linkedin", label: "LinkedIn", url: "https://example.com/company" }], workingHours: [{ day: "monday", opens: "09:00", closes: "17:00" }, { day: "sunday", closed: true }] }, draft: true, overrideAccess: false, user: asUser(staff) });
    }
  });
  it("serializes publication against concurrent edits without exposing unreviewed SEO", async () => {
    await payload.updateGlobal({ slug: "page-seo", data: { home: { title: "Concurrent reviewed title" } }, draft: true, overrideAccess: false, user: asUser(staff) });
    await payload.updateGlobal({ slug: "page-seo", data: { reviewState: "in-review" }, draft: true, overrideAccess: false, user: asUser(staff) });
    const results = await Promise.allSettled([
      payload.updateGlobal({ slug: "page-seo", data: { _status: "published" }, overrideAccess: false, user: asUser(admin) }),
      payload.updateGlobal({ slug: "page-seo", data: { home: { title: "Concurrent unreviewed title" } }, draft: true, overrideAccess: false, user: asUser(staff) }),
    ]);
    expect(results[1].status).toBe("fulfilled");
    expect((await payload.findGlobal({ slug: "page-seo", overrideAccess: false })).home?.title).not.toBe("Concurrent unreviewed title");
    const latest = await payload.findGlobal({ slug: "page-seo", draft: true, overrideAccess: false, user: asUser(staff) });
    expect(latest.reviewState).toBe("draft");
    // Restore the public/draft fixture used by the production HTTP suite.
    await payload.updateGlobal({ slug: "page-seo", data: { home: { title: "Approved homepage title", description: "Approved homepage description" } }, draft: true, overrideAccess: false, user: asUser(staff) });
    await payload.updateGlobal({ slug: "page-seo", data: { reviewState: "in-review" }, draft: true, overrideAccess: false, user: asUser(staff) });
    await payload.updateGlobal({ slug: "page-seo", data: { _status: "published" }, overrideAccess: false, user: asUser(admin) });
    await payload.updateGlobal({ slug: "page-seo", data: { home: { title: "Private draft homepage title" } }, draft: true, overrideAccess: false, user: asUser(staff) });
  });
  it("prevents version restoration from bypassing approval and supports admin unpublishing", async () => {
    const versions = await payload.findGlobalVersions({ slug: "company-settings", overrideAccess: false, user: asUser(admin) });
    await expect(payload.restoreGlobalVersion({ slug: "company-settings", id: versions.docs[0].id, overrideAccess: false, user: asUser(admin) })).rejects.toMatchObject({ status: 403 });
    await payload.updateGlobal({ slug: "company-settings", data: { _status: "draft" }, overrideAccess: false, user: asUser(admin) });
    expect((await payload.findGlobal({ slug: "company-settings", overrideAccess: false })).email).toBeUndefined();
    // Leave approved settings plus a private replacement for the real HTTP checks.
    await payload.updateGlobal({ slug: "company-settings", data: { email: "public-company@pazelgreen.test", phone: "+234 800 000 0000", reviewState: "draft" }, overrideAccess: false, user: asUser(staff) });
    await payload.updateGlobal({ slug: "company-settings", data: { reviewState: "in-review" }, overrideAccess: false, user: asUser(staff) });
    await payload.updateGlobal({ slug: "company-settings", data: { _status: "published" }, overrideAccess: false, user: asUser(admin) });
    await payload.updateGlobal({ slug: "company-settings", data: { email: "private-draft@pazelgreen.test" }, overrideAccess: false, user: asUser(staff) });
  });
});


describe("careers dictionaries, publication and permanent references", () => {
  let employment: EmploymentType;
  let department: Department;
  let otherDepartment: Department;
  let position: PositionCode;
  let mainJob: Job;
  const editor = () => ({ overrideAccess: false, user: asUser(staff) });
  const approver = () => ({ overrideAccess: false, user: asUser(admin) });
  async function approveDictionary(collection: "employment-types" | "departments" | "position-codes", id: number) {
    await payload.update({ collection, id, data: { reviewState: "in-review" }, ...approver() });
    return payload.update({ collection, id, data: { _status: "published" }, ...approver() });
  }
  const jobData = (slug: string) => ({ title: "Field systems engineer", slug, employmentType: employment.id, department: department.id, positionCode: position.id,
    location: "Lagos, Nigeria", arrangement: "hybrid" as const, summary: "Build dependable tools for agricultural teams.",
    responsibilities: "Design field tools\nCollaborate with growers", requirements: "Experience delivering reliable software\nClear written communication", deadlineTimezone: "Africa/Lagos", state: "open" as const });
  async function submit(id: number) { await payload.update({ collection: "jobs", id, data: { reviewState: "in-review" }, ...editor() }); }
  async function approve(id: number) { return payload.update({ collection: "jobs", id, data: { _status: "published" }, ...approver() }); }
  async function publish(id: number) { await submit(id); return approve(id); }

  it("restricts dictionary management to admins and normalizes safe unique codes", async () => {
    await expect(payload.create({ collection: "departments", draft: true, data: { name: "Blocked", code: "NO" }, ...editor() })).rejects.toThrow();
    employment = await payload.create({ collection: "employment-types", draft: true, data: { name: "Direct", code: " d " }, ...approver() });
    department = await payload.create({ collection: "departments", draft: true, data: { name: "Technology & Engineering", code: "te" }, ...approver() });
    otherDepartment = await payload.create({ collection: "departments", draft: true, data: { name: "Agriculture", code: "AG" }, ...approver() });
    position = await payload.create({ collection: "position-codes", draft: true, data: { name: "Department Head", code: "DH" }, ...approver() });
    expect(department.code).toBe("TE");
    expect((await payload.find({ collection: "departments", overrideAccess: false })).docs).toHaveLength(0);
    for (const [collection, id] of [["employment-types", employment.id], ["departments", department.id], ["departments", otherDepartment.id], ["position-codes", position.id]] as const) await approveDictionary(collection, id);
    await expect((async () => {
      const duplicate = await payload.create({ collection: "departments", draft: true, data: { name: "Duplicate", code: "TE" }, ...approver() });
      await approveDictionary("departments", duplicate.id);
    })()).rejects.toThrow();
    await expect(payload.delete({ collection: "departments", id: department.id, ...approver() })).rejects.toThrow();
    await expect(payload.find({ collection: "annual-advert-counters", ...approver() })).rejects.toMatchObject({ status: 403 });
  });
  it("gives drafts no reference, hides them and refuses staff publication", async () => {
    mainJob = await payload.create({ draft: true, collection: "jobs", data: { ...jobData("field-systems-engineer"), seo: { title: "Approved engineering opportunity", description: "Build agricultural systems at Pazelgreen." }, reference: "FORGED", referenceSequence: 999 }, ...editor() });
    expect(mainJob.reference).toBeFalsy();
    expect((await payload.find({ collection: "jobs", overrideAccess: false })).totalDocs).toBe(0);
    expect((await payload.find({ collection: "jobs", draft: true, overrideAccess: false })).totalDocs).toBe(0);
    await expect(payload.findVersions({ collection: "jobs", overrideAccess: false })).rejects.toThrow();
    await expect(payload.update({ collection: "jobs", id: mainJob.id, data: { _status: "published" }, ...editor() })).rejects.toMatchObject({ status: 403 });
    mainJob = await publish(mainJob.id);
    expect(mainJob.reference).toBe(`D-TE | DH-${advertYear()}-01`);
    expect(mainJob.referenceSequence).toBe(1);
    await expect(approve(mainJob.id)).rejects.toMatchObject({ status: 409 });
    expect((await payload.findByID({ collection: "jobs", id: mainJob.id, overrideAccess: false })).reference).toBe(mainJob.reference);
  });
  it("allocates one company-wide annual sequence across concurrent departments", async () => {
    const jobs = await Promise.all(Array.from({ length: 6 }, (_, index) => payload.create({ draft: true, collection: "jobs", data: { ...jobData(`concurrent-vacancy-${index}`), department: index % 2 ? department.id : otherDepartment.id }, ...editor() })));
    await Promise.all(jobs.map(job => submit(job.id)));
    const published = await Promise.all(jobs.map(job => approve(job.id)));
    expect(published.map(job => job.referenceSequence).sort((a, b) => a! - b!)).toEqual([2, 3, 4, 5, 6, 7]);
    expect(new Set(published.map(job => job.reference)).size).toBe(6);
    expect(published.every(job => job.referenceYear === advertYear())).toBe(true);
    // Remove these from public listings while preserving their issued IDs.
    for (const job of published) await payload.update({ collection: "jobs", id: job.id, data: { _status: "draft" }, ...approver() });
  });
  it("serializes two first-publication requests for the same advert without double allocation", async () => {
    const job = await payload.create({ draft: true, collection: "jobs", data: jobData("publication-retry"), ...editor() });
    await submit(job.id);
    const result = await Promise.allSettled([approve(job.id), approve(job.id)]);
    expect(result.filter(item => item.status === "fulfilled")).toHaveLength(1);
    const live = await payload.findByID({ collection: "jobs", id: job.id, overrideAccess: false });
    expect(live.referenceSequence).toBe(8);
    await payload.update({ collection: "jobs", id: job.id, data: { _status: "draft" }, ...approver() });
  });
  it("locks defining relationships and reference snapshots in drafts and database writes", async () => {
    await expect(payload.update({ collection: "jobs", id: mainJob.id, data: { department: otherDepartment.id }, ...editor() })).rejects.toMatchObject({ status: 409 });
    const changed = await payload.update({ collection: "jobs", id: mainJob.id, data: { reference: "FORGED", referenceSequence: 900 }, ...approver() });
    expect(changed.reference).toBe(mainJob.reference);
    expect(changed.referenceSequence).toBe(1);
    await expect(payload.db.pool.query("UPDATE jobs SET reference_sequence = 900 WHERE id = $1", [mainJob.id])).rejects.toThrow("immutable");
    await expect(payload.delete({ collection: "jobs", id: mainJob.id, ...approver() })).rejects.toThrow("cannot be deleted");
    await expect(payload.db.pool.query("DELETE FROM jobs WHERE id = $1", [mainJob.id])).rejects.toThrow("cannot be deleted");
  });
  it("keeps published adverts open during draft closure, then approves closure and reopening with the same ID", async () => {
    await payload.update({ collection: "jobs", id: mainJob.id, data: { state: "closed" }, ...editor() });
    expect((await payload.find({ collection: "jobs", where: openJobsWhere(), overrideAccess: false })).docs.some(job => job.id === mainJob.id)).toBe(true);
    const closed = await publish(mainJob.id);
    expect(closed.reference).toBe(mainJob.reference);
    expect((await payload.find({ collection: "jobs", where: openJobsWhere(), overrideAccess: false })).totalDocs).toBe(0);
    expect((await payload.findByID({ collection: "jobs", id: mainJob.id, overrideAccess: false })).state).toBe("closed");
    await payload.update({ collection: "jobs", id: mainJob.id, data: { state: "open" }, ...editor() });
    expect((await publish(mainJob.id)).reference).toBe(mainJob.reference);
  });
  it("preserves snapshots after dictionary changes and permits reopening with retired entries", async () => {
    await payload.update({ collection: "departments", id: department.id, data: { code: "TECH", active: false }, ...approver() });
    await approveDictionary("departments", department.id);
    await payload.update({ collection: "jobs", id: mainJob.id, data: { state: "closed" }, ...editor() });
    await publish(mainJob.id);
    await payload.update({ collection: "jobs", id: mainJob.id, data: { state: "open" }, ...editor() });
    expect((await publish(mainJob.id)).reference).toBe(mainJob.reference);
    const retired = await payload.create({ draft: true, collection: "jobs", data: jobData("retired-code-job"), ...editor() });
    await expect(publish(retired.id)).rejects.toThrow("activate");
    await payload.update({ collection: "departments", id: department.id, data: { active: true }, ...approver() });
    await approveDictionary("departments", department.id);
  });
  it("rolls back the counter when publication fails after allocation", async () => {
    const before = Number((await payload.db.pool.query("SELECT value FROM annual_advert_counters WHERE year = $1", [advertYear()])).rows[0].value);
    const duplicate = await payload.create({ draft: true, collection: "jobs", data: jobData("rollback-allocation"), ...editor() });
    await payload.update({ collection: "jobs", id: duplicate.id, data: { slug: "field-systems-engineer" }, ...editor() });
    await expect(publish(duplicate.id)).rejects.toThrow();
    expect(Number((await payload.db.pool.query("SELECT value FROM annual_advert_counters WHERE year = $1", [advertYear()])).rows[0].value)).toBe(before);
    expect((await payload.findByID({ collection: "jobs", id: duplicate.id, draft: true, ...editor() })).reference).toBeFalsy();
  });
  it("continues an annual counter above 99 and keeps other years independent", async () => {
    await payload.db.pool.query("UPDATE annual_advert_counters SET value = 99 WHERE year = $1", [advertYear()]);
    await payload.db.pool.query("INSERT INTO annual_advert_counters (year, value) VALUES ($1, 44)", [advertYear() - 1]);
    const overflow = await payload.create({ draft: true, collection: "jobs", data: jobData("sequence-overflow"), ...editor() });
    const issued = await publish(overflow.id);
    expect(issued.reference).toBe(`D-TECH | DH-${advertYear()}-100`);
    expect(Number((await payload.db.pool.query("SELECT value FROM annual_advert_counters WHERE year = $1", [advertYear() - 1])).rows[0].value)).toBe(44);
    await payload.update({ collection: "jobs", id: issued.id, data: { _status: "draft" }, ...approver() });
  });
  it("allocates a fresh counter at Lagos year rollover without renumbering existing adverts", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    try {
      async function publishAt(id: number, instant: string) {
        vi.setSystemTime(new Date(instant));
        await submit(id);
        vi.setSystemTime(new Date(Date.now() + 1000));
        return approve(id);
      }
      vi.setSystemTime(new Date("2034-12-31T22:59:55Z"));
      const prior = await payload.create({ draft: true, collection: "jobs", data: jobData("rollover-prior-year"), ...editor() });
      const first = await publishAt(prior.id, "2034-12-31T22:59:56Z");
      expect(first.referenceYear).toBe(2034);
      expect(first.referenceSequence).toBe(1);
      vi.setSystemTime(new Date("2034-12-31T23:00:00Z"));
      const next = await payload.create({ draft: true, collection: "jobs", data: jobData("rollover-next-year"), ...editor() });
      const second = await publishAt(next.id, "2034-12-31T23:00:01Z");
      expect(second.referenceYear).toBe(2035);
      expect(second.referenceSequence).toBe(1);
      vi.setSystemTime(new Date("2034-12-31T23:00:03Z"));
      await payload.update({ collection: "jobs", id: prior.id, data: { state: "closed" }, ...editor() });
      expect((await publishAt(prior.id, "2034-12-31T23:00:04Z")).reference).toBe(first.reference);
      for (const job of [first, second]) {
        vi.setSystemTime(new Date(Date.now() + 1000));
        await payload.update({ collection: "jobs", id: job.id, data: { _status: "draft" }, ...approver() });
      }
    } finally { vi.useRealTimers(); }
  });
  it("paginates open vacancies deterministically without including draft or withdrawn adverts", async () => {
    const jobs = await Promise.all(Array.from({ length: 13 }, (_, index) => payload.create({ draft: true, collection: "jobs", data: jobData(`pagination-vacancy-${index}`), ...editor() })));
    await Promise.all(jobs.map(job => submit(job.id)));
    await Promise.all(jobs.map(job => approve(job.id)));
    const query = { collection: "jobs" as const, where: openJobsWhere(), limit: 12, sort: ["-referenceYear", "-referenceSequence", "-id"], overrideAccess: false };
    const first = await payload.find({ ...query, page: 1 });
    const second = await payload.find({ ...query, page: 2 });
    expect(first.totalDocs).toBe(14);
    expect(first.docs).toHaveLength(12);
    expect(second.docs).toHaveLength(2);
    expect(first.docs.some(job => second.docs.some(other => other.id === job.id))).toBe(false);
    for (const job of jobs) await payload.update({ collection: "jobs", id: job.id, data: { _status: "draft" }, ...approver() });
  });
  it("excludes closed/expired/unpublished jobs while retaining public closed details", async () => {
    for (const [slug, state, deadline] of [["closed-vacancy", "closed", undefined], ["expired-vacancy", "open", "2020-01-01T00:00:00.000Z"]] as const) {
      const job = await payload.create({ draft: true, collection: "jobs", data: { ...jobData(slug), state, deadline, title: slug === "closed-vacancy" ? "Closed field coordinator" : "Expired field researcher" }, ...editor() });
      await publish(job.id);
    }
    await payload.create({ draft: true, collection: "jobs", data: { ...jobData("private-vacancy"), title: "Private draft vacancy" }, ...editor() });
    const withdrawn = await payload.create({ draft: true, collection: "jobs", data: jobData("withdrawn-vacancy"), ...editor() });
    await publish(withdrawn.id);
    await payload.update({ collection: "jobs", id: withdrawn.id, data: { _status: "draft" }, ...approver() });
    const open = await payload.find({ collection: "jobs", where: openJobsWhere(), overrideAccess: false });
    expect(open.docs.map(job => job.slug)).toEqual(["field-systems-engineer"]);
    expect((await payload.find({ collection: "jobs", overrideAccess: false })).docs.map(job => job.slug).sort()).toEqual(["closed-vacancy", "expired-vacancy", "field-systems-engineer"]);
    await payload.update({ collection: "jobs", id: mainJob.id, data: { title: "Private revised engineering vacancy", state: "closed", seo: { title: "Private job SEO" } }, ...editor() });
    const req = await request(staff); req.routeParams = { collection: "jobs", id: String(mainJob.id) };
    expect((await (await previewEndpoint.handler(req)).json()).title).toBe("Private revised engineering vacancy");
    await payload.updateGlobal({ slug: "page-seo", data: { careers: { title: "Approved careers listing SEO", description: "Approved careers listing description." }, home: { title: "Approved homepage title", description: "Approved homepage description" } }, ...editor() });
    await payload.updateGlobal({ slug: "page-seo", data: { reviewState: "in-review" }, ...editor() });
    await payload.updateGlobal({ slug: "page-seo", data: { _status: "published" }, ...approver() });
    // Preserve the pre-existing HTTP fixture's private homepage replacement.
    await payload.updateGlobal({ slug: "page-seo", data: { home: { title: "Private draft homepage title" } }, ...editor() });
  });
});

const blogText = (text: string) => ({ type: "text", version: 1, text, format: 0, detail: 0, mode: "normal", style: "" });
const blogBody = (text: string, mediaID?: number): Post["body"] => ({ root: {
  type: "root", version: 1, format: "", indent: 0, direction: "ltr", children: [
    { type: "paragraph", version: 1, format: "", indent: 0, direction: "ltr", children: [blogText(text)] },
    ...(mediaID ? [{ type: "upload", version: 3, relationTo: "media", value: mediaID, format: "" }] : []),
  ],
} });

describe("blog publication and public relationships", () => {
  let category: Category;
  let emptyCategory: Category;
  let blogImage: Media;
  let article: Post;
  let draftArticle: Post;
  const articleData = (slug: string) => ({ title: "Field notes: stronger food systems", slug, excerpt: "Test editorial updates from the Pazelgreen team.", authorName: "Pazelgreen editorial team", publicationDate: "2026-10-01T09:00:00.000Z", body: blogBody("Approved article body about connected agricultural systems."), categories: [category.id] });
  async function publishCategory(id: number) {
    await payload.update({ collection: "categories", id, data: { reviewState: "in-review" }, overrideAccess: false, user: asUser(staff) });
    return payload.update({ collection: "categories", id, data: { _status: "published" }, overrideAccess: false, user: asUser(admin) });
  }
  async function publishPost(id: number) {
    await payload.update({ collection: "posts", id, data: { reviewState: "in-review" }, overrideAccess: false, user: asUser(staff) });
    return payload.update({ collection: "posts", id, data: { _status: "published" }, overrideAccess: false, user: asUser(admin) });
  }
  it("keeps categories private until reviewed and prevents staff publishing or deleting", async () => {
    category = await payload.create({ collection: "categories", draft: true, data: { name: "Food systems", description: "Research and field updates on agricultural systems." }, overrideAccess: false, user: asUser(staff) });
    expect(category.slug).toBe("food-systems");
    expect((await payload.find({ collection: "categories", overrideAccess: false })).totalDocs).toBe(0);
    await expect(payload.update({ collection: "categories", id: category.id, data: { _status: "published" }, overrideAccess: false, user: asUser(staff) })).rejects.toMatchObject({ status: 403 });
    await expect(payload.delete({ collection: "categories", id: category.id, overrideAccess: false, user: asUser(staff) })).rejects.toThrow();
    category = await publishCategory(category.id);
    emptyCategory = await payload.create({ collection: "categories", draft: true, data: { name: "Company updates" }, overrideAccess: false, user: asUser(staff) });
    emptyCategory = await publishCategory(emptyCategory.id);
    expect((await payload.find({ collection: "categories", overrideAccess: false })).totalDocs).toBe(2);
  });
  it("prevents publication with unapproved cover or inline images, then allows approved assets", async () => {
    const bytes = await readFile(path.resolve("public/vision-bg.jpg"));
    blogImage = await payload.create({ collection: "media", draft: true, data: { alt: "Agricultural field used in blog test fixtures", caption: "A view across the fields." }, file: { name: "blog-fields.jpg", mimetype: "image/jpeg", size: bytes.length, data: bytes }, overrideAccess: false, user: asUser(staff) });
    article = await payload.create({ collection: "posts", draft: true, data: { ...articleData("field-notes"), coverImage: blogImage.id, body: blogBody("Approved article body about connected agricultural systems.", blogImage.id), seo: { title: "Approved field notes SEO", description: "Approved field notes description." } }, overrideAccess: false, user: asUser(staff) });
    await payload.update({ collection: "posts", id: article.id, data: { reviewState: "in-review" }, overrideAccess: false, user: asUser(staff) });
    await expect(payload.update({ collection: "posts", id: article.id, data: { _status: "published" }, overrideAccess: false, user: asUser(admin) })).rejects.toThrow("Publish every referenced");
    await payload.update({ collection: "media", id: blogImage.id, data: { reviewState: "in-review" }, overrideAccess: false, user: asUser(staff) });
    blogImage = await payload.update({ collection: "media", id: blogImage.id, data: { _status: "published" }, overrideAccess: false, user: asUser(admin) });
    article = await payload.update({ collection: "posts", id: article.id, data: { _status: "published" }, overrideAccess: false, user: asUser(admin) });
    const visible = await payload.findByID({ collection: "posts", id: article.id, overrideAccess: false, depth: 1 });
    expect(visible.title).toBe(article.title);
    expect(visible.authorName).toBe("Pazelgreen editorial team");
    expect(visible.reviewState).toBeUndefined();
    expect(visible.createdBy).toBeUndefined();
    expect(typeof visible.coverImage).toBe("object");
  });
  it("keeps live text, URLs and SEO unchanged while replacements are edited", async () => {
    await payload.update({ collection: "posts", id: article.id, data: { title: "Private revised field notes", body: blogBody("Private replacement article body."), seo: { title: "Private draft article SEO" } }, overrideAccess: false, user: asUser(staff) });
    const live = await payload.findByID({ collection: "posts", id: article.id, overrideAccess: false });
    expect(live.title).toBe("Field notes: stronger food systems");
    expect(live.seo?.title).toBe("Approved field notes SEO");
    const latest = await payload.findByID({ collection: "posts", id: article.id, draft: true, overrideAccess: false, user: asUser(staff) });
    expect(latest.title).toBe("Private revised field notes");
    expect(latest.reviewState).toBe("draft");
    await expect(payload.update({ collection: "posts", id: article.id, data: { _status: "published" }, overrideAccess: false, user: asUser(staff) })).rejects.toMatchObject({ status: 403 });
    await expect(payload.delete({ collection: "posts", id: article.id, overrideAccess: false, user: asUser(staff) })).rejects.toThrow();
  });
  it("requires approved categories, safe body content and distinct public slugs", async () => {
    const privateCategory = await payload.create({ collection: "categories", draft: true, data: { name: "Private category" }, overrideAccess: false, user: asUser(staff) });
    const blocked = await payload.create({ collection: "posts", draft: true, data: { ...articleData("blocked-category"), categories: [privateCategory.id] }, overrideAccess: false, user: asUser(staff) });
    await expect(publishPost(blocked.id)).rejects.toThrow("Publish every referenced");
    const blank = await payload.create({ collection: "posts", draft: true, data: { ...articleData("empty-body"), body: blogBody("") }, overrideAccess: false, user: asUser(staff) });
    await expect(publishPost(blank.id)).rejects.toThrow("Add article text");
    await expect((async () => {
      const duplicate = await payload.create({ collection: "posts", draft: true, data: articleData("field-notes"), overrideAccess: false, user: asUser(staff) });
      await publishPost(duplicate.id);
    })()).rejects.toThrow();
    expect((await payload.find({ collection: "posts", where: { slug: { equals: "field-notes" } }, overrideAccess: false })).totalDocs).toBe(1);
  });
  it("denies anonymous draft/history reads and permits authenticated JSON previews", async () => {
    draftArticle = await payload.create({ collection: "posts", draft: true, data: { ...articleData("draft-only-story"), title: "Private draft-only story" }, overrideAccess: false, user: asUser(staff) });
    await expect(payload.findByID({ collection: "posts", id: draftArticle.id, draft: true, overrideAccess: false })).rejects.toThrow();
    await expect(payload.findVersions({ collection: "posts", overrideAccess: false })).rejects.toThrow();
    const editor = await request(staff); editor.routeParams = { collection: "posts", id: String(draftArticle.id) };
    const response = await previewEndpoint.handler(editor);
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    expect((await response.json()).title).toBe("Private draft-only story");
    const anonymous = await request(); anonymous.routeParams = editor.routeParams;
    expect((await previewEndpoint.handler(anonymous)).status).toBe(403);
  });
  it("supports deterministic pagination, category filters and an empty published category", async () => {
    for (let index = 1; index <= 6; index++) {
      const post = await payload.create({ collection: "posts", draft: true, data: { ...articleData("field-report-" + index), title: "Field report " + index, publicationDate: "2026-09-0" + index + "T09:00:00.000Z", coverImage: blogImage.id }, overrideAccess: false, user: asUser(staff) });
      await publishPost(post.id);
    }
    const first = await payload.find({ collection: "posts", limit: 6, page: 1, sort: ["-publicationDate", "-id"], overrideAccess: false });
    const second = await payload.find({ collection: "posts", limit: 6, page: 2, sort: ["-publicationDate", "-id"], overrideAccess: false });
    expect(first.totalDocs).toBe(7);
    expect(first.docs).toHaveLength(6);
    expect(second.docs).toHaveLength(1);
    expect(first.docs.some(post => post.id === second.docs[0].id)).toBe(false);
    expect((await payload.find({ collection: "posts", where: { categories: { contains: emptyCategory.id } }, overrideAccess: false })).totalDocs).toBe(0);
    expect((await payload.find({ collection: "posts", where: { categories: { contains: category.id } }, overrideAccess: false })).totalDocs).toBe(7);
  });
  it("unpublishes articles immediately without exposing the draft and preserves history", async () => {
    const temporary = await payload.create({ collection: "posts", draft: true, data: articleData("withdrawn-story"), overrideAccess: false, user: asUser(staff) });
    await publishPost(temporary.id);
    await payload.update({ collection: "posts", id: temporary.id, data: { _status: "draft" }, overrideAccess: false, user: asUser(admin) });
    expect((await payload.find({ collection: "posts", where: { slug: { equals: "withdrawn-story" } }, overrideAccess: false })).totalDocs).toBe(0);
    expect((await payload.findVersions({ collection: "posts", where: { parent: { equals: temporary.id } }, overrideAccess: false, user: asUser(staff) })).totalDocs).toBeGreaterThan(0);
  });
});
