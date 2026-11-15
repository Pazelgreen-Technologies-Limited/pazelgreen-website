import nextEnv from "@next/env";
import { getPayload } from "payload";
import { deliverApplications } from "../cms/deliver-applications";

nextEnv.loadEnvConfig(process.cwd());
const { default: config } = await import("../payload.config");
const payload = await getPayload({ config });
try { console.info(`Recruitment delivery: ${await deliverApplications(payload)} queued applications processed.`); }
finally { await payload.destroy(); }
process.exit(0);
