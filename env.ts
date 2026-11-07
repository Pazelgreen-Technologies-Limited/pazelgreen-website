import path from "node:path";

type Environment = Record<string, string | undefined>;

/** Deployment environment is independent of Next's build-time NODE_ENV. */
export function getEnvironment(source: Environment = process.env) {
  const value = source.APP_ENV ?? (source.NODE_ENV === "production" ? "production" : "development");
  if (!["development", "production", "test"].includes(value)) {
    throw new Error("APP_ENV must be development, production, or test.");
  }
  return value as "development" | "production" | "test";
}

export function getServerEnvironment(source: Environment = process.env) {
  const appEnv = getEnvironment(source);
  const production = appEnv === "production";
  const databaseKey = production ? "PRODUCTION_DATABASE_URL" : appEnv === "test" ? "TEST_DATABASE_URL" : "DEV_DATABASE_URL";
  const databaseURL = source[databaseKey];
  if (!databaseURL) throw new Error(`${databaseKey} is required for APP_ENV=${appEnv}.`);
  let database: URL;
  try { database = new URL(databaseURL); } catch { throw new Error(`${databaseKey} is not a valid database URL.`); }
  if (!["postgres:", "postgresql:"].includes(database.protocol)) throw new Error("Database URL must use PostgreSQL.");
  if (production && ["localhost", "127.0.0.1", "::1", "[::1]", "postgres"].includes(database.hostname)) {
    throw new Error("Production must use a production database, not the local Docker database.");
  }
  const secret = source.PAYLOAD_SECRET;
  if (!secret || secret.length < 32) throw new Error("PAYLOAD_SECRET must contain at least 32 characters.");
  const serverURL = source.SERVER_URL || (production ? undefined : "http://localhost:3000");
  if (!serverURL || !["http:", "https:"].includes(new URL(serverURL).protocol)) throw new Error("SERVER_URL must be an HTTP(S) URL.");
  if (production && new URL(serverURL).protocol !== "https:") throw new Error("Production SERVER_URL must use HTTPS.");
  const publicStorage = source.PUBLIC_UPLOAD_DIR || (production ? undefined : path.resolve("storage/public"));
  const privateStorage = source.PRIVATE_UPLOAD_DIR || (production ? undefined : path.resolve("storage/private"));
  if (!publicStorage || !privateStorage || !path.isAbsolute(publicStorage) || !path.isAbsolute(privateStorage)) {
    throw new Error("Upload directories must be absolute paths; production requires persistent mounted directories.");
  }
  const relative = path.relative(publicStorage, privateStorage);
  const inverse = path.relative(privateStorage, publicStorage);
  if (!relative || !relative.startsWith("..") || !inverse.startsWith("..")) throw new Error("Public and private upload directories must be separate, non-nested directories.");
  for (const directory of [publicStorage, privateStorage]) {
    const fromStatic = path.relative(path.resolve("public"), directory);
    if (!fromStatic || (!fromStatic.startsWith(`..${path.sep}`) && fromStatic !== ".." && !path.isAbsolute(fromStatic))) throw new Error("CMS uploads must be outside Next's public directory.");
  }
  if (production && (!source.SMTP_HOST || !source.SMTP_USER || !source.SMTP_PASSWORD || !source.EMAIL_FROM_ADDRESS)) {
    throw new Error("Production requires SMTP_HOST, SMTP_USER, SMTP_PASSWORD, and EMAIL_FROM_ADDRESS.");
  }
  const smtpPort = Number(source.SMTP_PORT || (production ? "465" : "1025"));
  if (!Number.isInteger(smtpPort) || smtpPort < 1 || smtpPort > 65535) throw new Error("SMTP_PORT must be an integer between 1 and 65535.");
  return {
    appEnv, production, databaseURL, secret, serverURL: new URL(serverURL).origin,
    publicStorage, privateStorage,
    smtp: {
      host: source.SMTP_HOST || "127.0.0.1", port: smtpPort,
      secure: source.SMTP_SECURE === "true" || (production && source.SMTP_SECURE !== "false"),
      auth: source.SMTP_USER ? { user: source.SMTP_USER, pass: source.SMTP_PASSWORD || "" } : undefined,
    },
    emailFrom: source.EMAIL_FROM_ADDRESS || "cms@pazelgreen.test",
  };
}
