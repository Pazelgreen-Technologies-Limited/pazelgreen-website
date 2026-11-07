import type { Access, PayloadRequest } from "payload";

export const isStaff = (user: PayloadRequest["user"]) =>
  Boolean(user?.active && (user.role === "admin" || user.role === "staff"));
export const isAdmin = (user: PayloadRequest["user"]) => Boolean(isStaff(user) && user?.role === "admin");
export const staffOnly: Access = ({ req }) => isStaff(req.user);
export const adminOnly: Access = ({ req }) => isAdmin(req.user);
export const nobody: Access = () => false;
export const publishedOrStaff: Access = ({ req }) => isStaff(req.user) || { _status: { equals: "published" } };
