import nextEnv from "@next/env";
import { spawnSync } from "node:child_process";
import { getEnvironment } from "../env";
import { localDatabaseVariables } from "./database-config";

nextEnv.loadEnvConfig(process.cwd());
if (getEnvironment() !== "development") {
  throw new Error("Docker database commands are available only with APP_ENV=development.");
}
const action = process.argv[2];
if (!["up", "stop", "ps", "exec", "logs"].includes(action)) throw new Error("Expected up, stop, ps, exec or logs.");
const args = action === "up" ? ["up", "-d", "--wait"] : ["exec", "logs"].includes(action) ? [action, ...process.argv.slice(3)] : [action];
const result = spawnSync("docker", ["compose", ...args], {
  stdio: "inherit", env: { ...process.env, ...localDatabaseVariables(process.env.DEV_DATABASE_URL) },
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
