#!/bin/sh
set -e

export NODE_ENV=production
export AUTH_TRUST_HOST=true

PORT="${PORT:-3000}"
HOST="${HOSTNAME:-::}"

echo "=== remax-crm starting ==="
echo "PORT=$PORT HOST=$HOST"

if [ -z "$DATABASE_URL" ]; then
  echo "FATAL: DATABASE_URL is not set."
  echo "Railway: add PostgreSQL, then Variables -> Add Reference -> Postgres.DATABASE_URL"
  exit 1
fi

if [ -z "$AUTH_SECRET" ]; then
  echo "FATAL: AUTH_SECRET is not set."
  echo "Railway: add AUTH_SECRET (run: openssl rand -base64 32)"
  exit 1
fi

echo "Running migrations..."
npx prisma migrate deploy

echo "Starting Next.js on $HOST:$PORT ..."
exec node node_modules/next/dist/bin/next start -H "$HOST" -p "$PORT"
