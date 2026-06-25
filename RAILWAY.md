# If DATABASE_URL reference stays empty on Railway

## Option A — Copy the connection string (most reliable)

1. Click your **Postgres** service (not remax-crm)
2. Go to **Variables**
3. Find **`DATABASE_URL`** and click the **eye icon** to reveal it
4. Click **copy**
5. Click **remax-crm** service → **Variables**
6. Delete the empty `DATABASE_URL` if it exists
7. **+ New Variable** → type **RAW** (not reference):
   - Name: `DATABASE_URL`
   - Value: **paste** what you copied
8. Click **Deploy**

## Option B — Reference all PG variables

On **remax-crm** → Variables, add these as **references** from Postgres:

| Variable | Reference from Postgres |
|----------|-------------------------|
| `PGHOST` | Postgres → PGHOST |
| `PGUSER` | Postgres → PGUSER |
| `PGPASSWORD` | Postgres → PGPASSWORD |
| `PGDATABASE` | Postgres → PGDATABASE |
| `PGPORT` | Postgres → PGPORT |

The app will build `DATABASE_URL` automatically from these.

## After deploy

Wait until status is **Active**, then login:
- https://remax-crm-production-f9b8.up.railway.app/login
- admin@remax.com / admin123
