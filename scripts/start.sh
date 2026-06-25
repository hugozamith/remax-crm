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
  exit 1
fi

if [ -z "$AUTH_SECRET" ]; then
  echo "FATAL: AUTH_SECRET is not set."
  exit 1
fi

echo "Running migrations..."
npx prisma migrate deploy
echo "Migrations done."

echo "Starting Next.js on $HOST:$PORT ..."
exec node node_modules/next/dist/bin/next start -H "$HOST" -p "$PORT"
