#!/bin/sh
set -e

export NODE_ENV=production
export AUTH_TRUST_HOST=true
export NEXTAUTH_SECRET="${AUTH_SECRET}"
export NEXTAUTH_URL="${AUTH_URL:-}"

PORT="${PORT:-3000}"
HOST="0.0.0.0"

echo "=== remax-crm starting ==="
echo "PORT=$PORT"

# Railway: resolve database URL from several sources
if [ -z "$DATABASE_URL" ] || [ "$DATABASE_URL" = '${{Postgres.DATABASE_URL}}' ]; then
  DATABASE_URL=""
fi

if [ -z "$DATABASE_URL" ] && [ -n "$DATABASE_PRIVATE_URL" ]; then
  export DATABASE_URL="$DATABASE_PRIVATE_URL"
  echo "Using DATABASE_PRIVATE_URL."
fi

if [ -z "$DATABASE_URL" ]; then
  if [ -n "$PGHOST" ] && [ -n "$PGUSER" ] && [ -n "$PGPASSWORD" ] && [ -n "$PGDATABASE" ]; then
    PGPORT="${PGPORT:-5432}"
    export DATABASE_URL="postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}?schema=public"
    echo "Built DATABASE_URL from PG* variables."
  fi
fi

if [ -z "$DATABASE_URL" ]; then
  echo "FATAL: DATABASE_URL is not set."
  echo "Fix: Copy DATABASE_URL from Postgres -> Variables and paste it on remax-crm."
  exit 1
fi

if echo "$DATABASE_URL" | grep -qE 'localhost|127\.0\.0\.1'; then
  echo "FATAL: DATABASE_URL points to localhost."
  exit 1
fi

if [ -z "$AUTH_SECRET" ]; then
  echo "FATAL: AUTH_SECRET is not set."
  exit 1
fi

(
  echo "Running migrations..."
  npx prisma migrate deploy
  echo "Seeding database..."
  npx prisma db seed
  echo "Database ready."
) &

echo "Starting Next.js on $HOST:$PORT ..."
exec node node_modules/next/dist/bin/next start -H "$HOST" -p "$PORT"
