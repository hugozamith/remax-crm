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

# Diagnostic: show which DB-related vars exist (not their values)
for var in DATABASE_URL DATABASE_PRIVATE_URL DATABASE_PUBLIC_URL PGHOST PGUSER PGDATABASE PGPORT; do
  eval "val=\$$var"
  if [ -n "$val" ]; then
    echo "  $var is set"
  else
    echo "  $var is NOT set"
  fi
done

RESOLVED_URL=$(sh scripts/resolve-db-url.sh) || {
  echo ""
  echo "FATAL: Cannot connect to database."
  echo ""
  echo "On Railway -> remax-crm -> Variables, add these as REFERENCES from Postgres:"
  echo "  PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT"
  echo ""
  echo "See RAILWAY.md for step-by-step instructions."
  exit 1
}

export DATABASE_URL="$RESOLVED_URL"
echo "Database URL resolved successfully."

if [ -z "$AUTH_SECRET" ]; then
  echo "FATAL: AUTH_SECRET is not set."
  exit 1
fi

(
  echo "Running migrations..."
  npx prisma migrate deploy
  echo "Seeding database..."
  npx prisma db seed
  echo "Database ready. Login: admin@remax.com / admin123"
) &

echo "Starting Next.js on $HOST:$PORT ..."
exec node node_modules/next/dist/bin/next start -H "$HOST" -p "$PORT"
