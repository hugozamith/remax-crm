function isValidDatabaseUrl(url?: string | null): url is string {
  if (!url || url.trim() === "") return false;
  if (url.includes("${{")) return false;
  if (url.includes("localhost") || url.includes("127.0.0.1")) return false;
  return url.startsWith("postgresql://") || url.startsWith("postgres://");
}

export function resolveDatabaseUrl(): string {
  const fromEnv = [
    process.env.DATABASE_URL,
    process.env.DATABASE_PRIVATE_URL,
    process.env.DATABASE_PUBLIC_URL,
  ];

  for (const url of fromEnv) {
    if (isValidDatabaseUrl(url)) return url;
  }

  const user = process.env.PGUSER || process.env.POSTGRES_USER;
  const password = process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD;
  const host = process.env.PGHOST;
  const port = process.env.PGPORT || "5432";
  const database = process.env.PGDATABASE || process.env.POSTGRES_DB;

  if (user && password && host && database) {
    return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}?schema=public`;
  }

  throw new Error(
    "Database not configured. On Railway, add Postgres variable references to remax-crm (see RAILWAY.md)."
  );
}

export function ensureDatabaseUrl(): string {
  const resolved = resolveDatabaseUrl();
  process.env.DATABASE_URL = resolved;
  return resolved;
}

export function getDatabaseConfigSource(): string {
  if (isValidDatabaseUrl(process.env.DATABASE_URL)) return "DATABASE_URL";
  if (isValidDatabaseUrl(process.env.DATABASE_PRIVATE_URL))
    return "DATABASE_PRIVATE_URL";
  if (isValidDatabaseUrl(process.env.DATABASE_PUBLIC_URL))
    return "DATABASE_PUBLIC_URL";
  if (process.env.PGHOST && process.env.PGUSER) return "PG* variables";
  return "none";
}
