import { isStaff } from "./access";
import type { Endpoint } from "payload";

// JSON draft preview is useful before frontend blog/careers routes are implemented.
export const previewEndpoint: Endpoint = {
  path: "/preview/:collection/:id", method: "get",
  handler: async (req) => {
    if (!isStaff(req.user)) return Response.json({ error: "Authentication required." }, { status: 403 });
    const { collection, id } = req.routeParams ?? {};
    // Extend deliberately as T04–T10 add review-enabled content collections.
    if (collection !== "media" || typeof id !== "string") return Response.json({ error: "Preview not found." }, { status: 404 });
    const doc = await req.payload.findByID({ collection, id, draft: true, overrideAccess: false, user: req.user, req });
    return Response.json(doc, { headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" } });
  },
};
