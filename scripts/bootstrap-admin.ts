import nextEnv from "@next/env";
import { getPayload } from "payload";
import { ensureFirstAdmin } from "../cms/bootstrap";

nextEnv.loadEnvConfig(process.cwd());
const { default: config } = await import("../payload.config");
const payload = await getPayload({ config });
try {
  const created = await ensureFirstAdmin(payload);
  console.info(created ? "First administrator created. Change your password after signing in and remove bootstrap credentials from your environment." : "Administrator already exists; credentials unchanged.");
} finally {
  await payload.destroy();
}
await new Promise<void>((resolve) => { process.stdout.write("", () => resolve()); });
process.exit(0);
