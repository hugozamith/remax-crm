# Railway deploy checklist

Your app **will crash** until these 3 variables exist on the **remax-crm web service** (not the database).

## 1. Add PostgreSQL

In your Railway project: **+ New → Database → PostgreSQL**

## 2. Link DATABASE_URL

1. Click the **remax-crm** service (not Postgres)
2. Go to **Variables**
3. Click **+ New Variable → Add Reference**
4. Select your **Postgres** service
5. Pick **DATABASE_URL**
6. Save

## 3. Add AUTH_SECRET

1. Still on remax-crm → Variables
2. **+ New Variable**
3. Name: `AUTH_SECRET`
4. Value: any long random string (e.g. `my-super-secret-key-change-me-32chars`)

## 4. Add AUTH_URL (after first deploy)

1. remax-crm → **Settings → Networking → Generate Domain**
2. Copy the URL (e.g. `https://remax-crm-production.up.railway.app`)
3. Variables → add `AUTH_URL` with that exact URL

## 5. Disable healthcheck in Railway UI (if deploy still fails)

1. remax-crm → **Settings**
2. Search **health**
3. Clear/delete the **Healthcheck Path** field if it shows `/login` or `/api/health`
4. Save and redeploy

## 6. Seed database (once deploy is live)

remax-crm → **Settings → Deploy → Run command**:

```
npx prisma db seed
```

Login: `admin@remax.com` / `admin123`

## Check deploy logs

If it still crashes, open **Deployments → Deploy Logs** and look for:

- `FATAL: DATABASE_URL is not set` → step 2 not done
- `FATAL: AUTH_SECRET is not set` → step 3 not done
- `Can't reach database server` → Postgres not in same project or wrong reference
