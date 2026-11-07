import { createHash, randomBytes } from "node:crypto";
import { sql } from "@payloadcms/db-postgres";
import { APIError, type CollectionConfig } from "payload";
import { adminOnly, nobody } from "./access";
import { audit } from "./audit";
import { getServerEnvironment } from "../env";
import { transactionDatabase } from "./transactions";

export const hashInvitation = (token: string) => createHash("sha256").update(token).digest("hex");

export const Invitations: CollectionConfig = {
  slug: "invitations",
  admin: { useAsTitle: "email", group: "Administration", description: "Create an invitation to email a single-use activation link. Delete an unused invitation to revoke it." },
  access: { create: adminOnly, read: adminOnly, update: nobody, delete: adminOnly },
  fields: [
    { name: "email", type: "email", required: true },
    { name: "name", type: "text", required: true },
    { name: "role", type: "select", required: true, defaultValue: "staff", options: ["admin", "staff"] },
    { name: "tokenHash", type: "text", unique: true, index: true, admin: { hidden: true }, access: { read: () => false } },
    { name: "expiresAt", type: "date", admin: { readOnly: true } },
    { name: "acceptedAt", type: "date", admin: { readOnly: true } },
    { name: "invitedBy", type: "text", admin: { readOnly: true } },
  ],
  hooks: {
    beforeChange: [async ({ data, operation, req }) => {
      if (operation !== "create") return data;
      const existing = await req.payload.count({ collection: "users", where: { email: { equals: data.email.toLowerCase().trim() } }, overrideAccess: true, req });
      if (existing.totalDocs) throw new APIError("This email already has an account.", 409);
      const token = randomBytes(32).toString("hex");
      req.context.invitationToken = token;
      return { ...data, email: data.email.toLowerCase().trim(), tokenHash: hashInvitation(token), acceptedAt: null,
        expiresAt: new Date(Date.now() + 86400000).toISOString(), invitedBy: String(req.user?.id) };
    }],
    afterChange: [async ({ doc, operation, req }) => {
      if (operation !== "create") return;
      const url = new URL("/admin/accept-invitation", getServerEnvironment().serverURL);
      url.searchParams.set("token", String(req.context.invitationToken));
      await req.payload.sendEmail({ to: doc.email, subject: "Activate your Pazelgreen CMS account", text: `An administrator invited you to Pazelgreen CMS. Set your password using this single-use link within 24 hours:\n${url}\nIf you did not expect this invitation, ignore it.` });
      delete req.context.invitationToken;
      await audit(req, "invitation.created", `invitations:${doc.id}`);
    }],
  },
  endpoints: [{
    path: "/accept", method: "post",
    handler: async (req) => {
      let body: unknown;
      try { body = await req.json?.(); }
      catch { return Response.json({ error: "A valid JSON request body is required." }, { status: 400 }); }
      if (!body || typeof body !== "object" || !("token" in body) || !("password" in body) ||
        typeof body.token !== "string" || !/^[a-f0-9]{64}$/.test(body.token) || typeof body.password !== "string" || body.password.length < 12 || body.password.length > 256) {
        return Response.json({ error: "A valid invitation and password of 12–256 characters are required." }, { status: 400 });
      }
      const transaction = await req.payload.db.beginTransaction();
      if (!transaction) throw new APIError("A database transaction is required.", 503);
      req.transactionID = transaction;
      try {
        // Serialize redemption in the SAME transaction as user creation and consumption.
        await transactionDatabase(req.payload, transaction).execute(sql`SELECT id FROM invitations WHERE token_hash = ${hashInvitation(body.token)} FOR UPDATE`);
        const found = await req.payload.find({ collection: "invitations", where: { and: [
          { tokenHash: { equals: hashInvitation(body.token) } }, { acceptedAt: { exists: false } }, { expiresAt: { greater_than: new Date().toISOString() } },
        ] }, limit: 1, overrideAccess: true, req });
        const invitation = found.docs[0];
        if (!invitation) throw new APIError("Invitation is invalid or expired.", 400);
        req.context.acceptInvitation = true;
        const user = await req.payload.create({ collection: "users", data: { email: invitation.email, name: invitation.name, role: invitation.role, active: true, password: body.password }, overrideAccess: true, req });
        await req.payload.update({ collection: "invitations", id: invitation.id, data: { acceptedAt: new Date().toISOString() }, overrideAccess: true, req });
        await audit(req, "invitation.accepted", `users:${user.id}`);
        await req.payload.db.commitTransaction(transaction);
        return Response.json({ message: "Account activated. You can now sign in." }, { status: 201 });
      } catch (error) {
        await req.payload.db.rollbackTransaction(transaction);
        if (error instanceof APIError) return Response.json({ error: error.message }, { status: error.status });
        // Do not log request data, activation tokens, passwords, or email addresses.
        return Response.json({ error: "Unable to activate this invitation." }, { status: 400 });
      } finally {
        delete req.context.acceptInvitation;
        delete req.transactionID;
      }
    },
  }],
};
