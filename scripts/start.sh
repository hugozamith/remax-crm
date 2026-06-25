#!/bin/sh
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set."
  echo "In Railway: add PostgreSQL, then on the web service set DATABASE_URL = \${{Postgres.DATABASE_URL}}"
  exit 1
fi

if [ -z "$AUTH_SECRET" ]; then
  echo "ERROR: AUTH_SECRET is not set."
  exit 1
fi

npx prisma migrate deploy
exec npx next start -H 0.0.0.0 -p "${PORT:-3000}"
