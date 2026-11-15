import { APIError, getPayload } from "payload";
import config from "@payload-config";
import { submitApplication } from "@/cms/submit-application";
import { maxCVBytes } from "@/cms/recruitment-rules";

export async function POST(request: Request) {
  const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" };
  // Next can normalize request.url to an internal host behind a proxy. Compare
  // against the configured public origin, never the untrusted Host header.
  if (request.headers.get("origin") !== (await config).serverURL) return Response.json({ error: "Submit from the application page." }, { status: 403, headers });
  try {
    // Bound streaming bodies too, rather than trusting Content-Length.
    const reader = request.body?.getReader();
    if (!reader) throw new APIError("Application is empty.", 400);
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxCVBytes + 65536) { await reader.cancel(); throw new APIError("Application upload is too large.", 413); }
      chunks.push(value);
    }
    const form = await new Response(Buffer.concat(chunks), { headers: { "Content-Type": request.headers.get("content-type") ?? "" } }).formData();
    const payload = await getPayload({ config });
    return Response.json(await submitApplication(payload, form), { status: 201, headers });
  } catch (error) {
    return Response.json({ error: error instanceof APIError && error.isPublic ? error.message : "Unable to submit. Keep this page open and retry, or try again later." }, { status: error instanceof APIError ? error.status : 503, headers });
  }
}
