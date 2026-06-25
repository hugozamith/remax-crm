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

if [ -z "$DATABASE_URL" ]; then
  echo "FATAL: DATABASE_URL is not set."
  echo "Fix: Railway -> remax-crm -> Variables -> Add Reference -> Postgres -> DATABASE_URL"
  exit 1
fi

if echo "$DATABASE_URL" | grep -qE 'localhost|127\.0\.0\.1'; then
  echo "FATAL: DATABASE_URL points to localhost — that only works on your computer."
  echo "Fix: Delete DATABASE_URL in Railway Variables, then re-add it as:"
  echo "  + New Variable -> Add Reference -> Postgres service -> DATABASE_URL"
  exit 1
fi

if [ -z "$AUTH_SECRET" ]; then
  echo "FATAL: AUTH_SECRET is not set."
  exit 1
fi

# Migrations in background so the server starts immediately (avoids 502)
(
  echo "Running migrations..."
  npx prisma migrate deploy
  echo "Seeding database..."
  npx prisma db seed
  echo "Database ready. Login: admin@remax.com / admin123"
) &

echo "Starting Next.js on $HOST:$PORT ..."
exec node node_modules/next/dist/bin/next start -H "$HOST" -p "$PORT"
