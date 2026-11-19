import type { Access, PayloadRequest } from "payload";

export const isStaff = (user: PayloadRequest["user"]) =>
  Boolean(user?.active && !user.mustChangePassword && (user.role === "admin" || user.role === "staff"));
export const isAdmin = (user: PayloadRequest["user"]) => Boolean(isStaff(user) && user?.role === "admin");
export const adminOnly: Access = ({ req }) => isAdmin(req.user);
export const nobody: Access = () => false;
