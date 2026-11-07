import nextEnv from "@next/env";
import { spawnSync } from "node:child_process";
import { getEnvironment } from "../env";

nextEnv.loadEnvConfig(process.cwd());
if (getEnvironment() !== "development") {
  throw new Error("Docker database commands are available only with APP_ENV=development.");
}
const action = process.argv[2];
if (action !== "up" && action !== "stop") throw new Error("Expected up or stop.");
const result = spawnSync("docker", ["compose", ...(action === "up" ? ["up", "-d", "--wait"] : ["stop"])], { stdio: "inherit" });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
