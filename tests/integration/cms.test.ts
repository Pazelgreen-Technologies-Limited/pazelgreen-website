import path from "node:path";
import { spawn } from "node:child_process";
import nextEnv from "@next/env";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createLocalReq, getPayload, type Payload, type PayloadRequest } from "payload";
import { sql } from "@payloadcms/db-postgres";
import type { User } from "../../payload-types";
import { hashInvitation, Invitations } from "../../cms/invitations";
import { previewEndpoint } from "../../cms/preview";

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
      env: { ...process.env, BOOTSTRAP_ADMIN_EMAIL: "admin@pazelgreen.test", BOOTSTRAP_ADMIN_PASSWORD: password },
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
  await payload.db.drizzle.execute(sql`TRUNCATE users, invitations, audit_events, media, private_files RESTART IDENTITY CASCADE`);
  bootstrapResults = await Promise.all([bootstrap(), bootstrap()]);
  admin = (await payload.find({ collection: "users", overrideAccess: true, where: { email: { equals: "admin@pazelgreen.test" } } })).docs[0];
  if (!admin) throw new Error("CLI bootstrap did not create the fixture administrator.");
  staff = await createAccount("staff@pazelgreen.test", "staff");
});

afterAll(async () => { if (payload) await payload.destroy(); });

describe("accounts and access", () => {
  it("bootstraps only one first admin across simultaneous CLI processes", () => {
    expect(bootstrapResults.map((result) => result.code).sort(), JSON.stringify(bootstrapResults)).toEqual([0, 1]);
    expect(bootstrapResults.find((result) => result.code === 0)?.output).toContain("First administrator created");
    expect(bootstrapResults.find((result) => result.code === 1)?.output).toContain("Bootstrap refused");
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
