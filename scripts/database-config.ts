/** Compose-only variables derived from the single local connection URL. */
export function localDatabaseVariables(value: string | undefined) {
  let url: URL;
  try { url = new URL(value ?? ""); } catch { throw new Error("Set a valid DEV_DATABASE_URL before starting Docker."); }
  if (!["postgres:", "postgresql:"].includes(url.protocol) || !["localhost", "127.0.0.1"].includes(url.hostname)) {
    throw new Error("Docker requires a local PostgreSQL DEV_DATABASE_URL (localhost or 127.0.0.1).");
  }
  try {
    const database = decodeURIComponent(url.pathname.slice(1));
    const user = decodeURIComponent(url.username);
    const password = decodeURIComponent(url.password);
    if (!database || database.includes("/") || !user || !password) throw new Error();
    return { POSTGRES_DB: database, POSTGRES_USER: user, POSTGRES_PASSWORD: password, POSTGRES_PORT: url.port || "5432" };
  } catch { throw new Error("DEV_DATABASE_URL must include a database name, username and URL-encoded password."); }
}
