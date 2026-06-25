#!/bin/sh
# Resolves DATABASE_URL from any Railway Postgres variable format.

is_valid_url() {
  url="$1"
  [ -n "$url" ] || return 1
  echo "$url" | grep -q '\${{' && return 1
  echo "$url" | grep -qE 'localhost|127\.0\.0\.1' && return 1
  echo "$url" | grep -qE '^postgres(ql)?://' 
}

try_url() {
  if is_valid_url "$1"; then
    echo "$1"
    return 0
  fi
  return 1
}

# Try direct URL variables first
for var in DATABASE_URL DATABASE_PRIVATE_URL DATABASE_PUBLIC_URL; do
  eval "val=\$$var"
  resolved=$(try_url "$val") && echo "$resolved" && return 0
done

# Build from individual PG variables (Railway always provides these on Postgres)
PGUSER="${PGUSER:-$POSTGRES_USER}"
PGPASSWORD="${PGPASSWORD:-$POSTGRES_PASSWORD}"
PGDATABASE="${PGDATABASE:-$POSTGRES_DB}"
PGPORT="${PGPORT:-5432}"

if [ -n "$PGHOST" ] && [ -n "$PGUSER" ] && [ -n "$PGPASSWORD" ] && [ -n "$PGDATABASE" ]; then
  echo "postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}?schema=public"
  return 0
fi

return 1
