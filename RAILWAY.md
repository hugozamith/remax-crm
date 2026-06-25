# Railway setup — fix empty DATABASE_URL

Railway **hides** reference variable values in the UI (shows blank). That is normal.
What matters is that the **right references exist** on the `remax-crm` service.

## Step 1: Check your Postgres service name

1. Click the **Postgres** box in your project
2. Go to **Settings**
3. Note the **Service Name** at the top (usually `Postgres`)

## Step 2: Add PG variable references to remax-crm

Click **remax-crm** → **Variables** → for each row below:

1. Click **+ New Variable**
2. Click **Add Reference** (right side)
3. Pick **Postgres** → pick the variable name
4. The left side (VARIABLE_NAME) must match exactly:

| VARIABLE_NAME | Reference from Postgres |
|---------------|----------------------|
| `PGHOST`      | `PGHOST`             |
| `PGUSER`      | `PGUSER`             |
| `PGPASSWORD`  | `PGPASSWORD`         |
| `PGDATABASE`  | `PGDATABASE`         |
| `PGPORT`      | `PGPORT`             |

Add all 5. The app builds the connection string automatically from these.

> You do NOT need `DATABASE_URL` if all 5 PG variables are set.

## Step 3: Other required variables

| VARIABLE_NAME | Value |
|---------------|-------|
| `AUTH_SECRET` | any long random string |
| `AUTH_URL`    | `https://remax-crm-production-f9b8.up.railway.app` |

## Step 4: Deploy

Click **Deploy** and wait for **Active**.

## Step 5: Verify

Open: `https://YOUR-URL.up.railway.app/api/health`

Should show:
```json
{"status":"ok","database":"connected","source":"PG* variables"}
```

## Step 6: Login

`https://YOUR-URL.up.railway.app/login`

- Email: `admin@remax.com`
- Password: `admin123`

---

## Fallback: paste connection string directly

If references still fail:

1. **Postgres** → **Variables** → reveal **`DATABASE_URL`** → copy
2. **remax-crm** → **Variables** → **+ New Variable** (RAW, not reference)
3. Name: `DATABASE_URL`, Value: paste
4. Deploy
