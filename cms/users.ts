import { randomBytes } from "node:crypto";
import { APIError, type CollectionConfig } from "payload";
import { adminOnly, isAdmin, isStaff } from "./access";
import { audit } from "./audit";
import { getEnvironment } from "../env";

export const Users: CollectionConfig = {
  slug: "users",
  admin: { useAsTitle: "email", group: "Administration" },
  auth: {
    tokenExpiration: 7200, maxLoginAttempts: 5, lockTime: 600000,
    cookies: { sameSite: "Strict", secure: getEnvironment() === "production" },
    forgotPassword: { expiration: 3600000 },
  },
  access: {
    admin: ({ req }) => isStaff(req.user),
    create: ({ req }) => Boolean(req.context.bootstrapAdmin || req.context.acceptInvitation),
    read: ({ req }) => isAdmin(req.user) || (isStaff(req.user) ? { id: { equals: req.user!.id } } : false),
    update: ({ req }) => isAdmin(req.user) || (isStaff(req.user) ? { id: { equals: req.user!.id } } : false),
    delete: adminOnly,
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "role", type: "select", required: true, defaultValue: "staff", options: ["admin", "staff"], saveToJWT: true,
      access: { update: ({ req }) => isAdmin(req.user) } },
    { name: "active", type: "checkbox", defaultValue: true, saveToJWT: true,
      access: { update: ({ req }) => isAdmin(req.user) } },
    { name: "password", type: "text", minLength: 12, maxLength: 256, admin: { hidden: true } },
  ],
  hooks: {
    beforeLogin: [({ user }) => {
      if (!user.active) throw new APIError("This account is inactive.", 403);
      return user;
    }],
    beforeChange: [async ({ data, operation, originalDoc, req }) => {
      if (operation === "create") {
        if (!req.context.bootstrapAdmin && !req.context.acceptInvitation) throw new APIError("Use an administrator invitation to create accounts.", 403);
        if (!data.password) data.password = randomBytes(48).toString("hex");
      }
      if (operation === "update" && !isAdmin(req.user) && !req.context.cmsSystem) {
        if ((data.role !== undefined && data.role !== originalDoc.role) || (data.active !== undefined && data.active !== originalDoc.active)) {
          throw new APIError("Only administrators can change roles or account status.", 403);
        }
        // Payload's own reset-token updates bypass access, but must not broaden profile edits.
        if (req.user && req.user.id !== originalDoc.id) throw new APIError("You can only update your own profile.", 403);
      }
      if (originalDoc?.active && (data.active === false || (data.role && data.role !== "admin")) && originalDoc.role === "admin") {
        const admins = await req.payload.count({ collection: "users", where: { and: [{ role: { equals: "admin" } }, { active: { equals: true } }] }, overrideAccess: true, req });
        if (admins.totalDocs <= 1) throw new APIError("The final active administrator cannot be deactivated or demoted.", 409);
      }
      if (data.active === false || (originalDoc && data.role && data.role !== originalDoc.role)) data.sessions = [];
      return data;
    }],
    beforeDelete: [async ({ id, req }) => {
      const user = await req.payload.findByID({ collection: "users", id, overrideAccess: true, req });
      if (user.active && user.role === "admin") {
        const admins = await req.payload.count({ collection: "users", where: { and: [{ role: { equals: "admin" } }, { active: { equals: true } }] }, overrideAccess: true, req });
        if (admins.totalDocs <= 1) throw new APIError("The final active administrator cannot be deleted.", 409);
      }
      await audit(req, "user.deleted", `users:${id}`);
    }],
    afterChange: [async ({ doc, operation, req }) => { await audit(req, `user.${operation}`, `users:${doc.id}`); }],
  },
};
