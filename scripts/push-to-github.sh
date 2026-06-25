#!/usr/bin/env bash
set -euo pipefail

export PATH="/home/hhzamith/.local/node/bin:$PATH"
cd "$(dirname "$0")/.."

echo "==> Creating GitHub repo and pushing..."
gh repo create hugozamith/remax-crm --public --source=. --remote=origin --push

echo ""
echo "Done! Repo: https://github.com/hugozamith/remax-crm"
echo ""
echo "Next: deploy on Railway"
echo "  1. Go to https://railway.app/new"
echo "  2. Deploy from GitHub → select remax-crm"
echo "  3. Add PostgreSQL database"
echo "  4. Set AUTH_SECRET and AUTH_URL on the web service (see README)"
