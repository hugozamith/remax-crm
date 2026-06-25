# RE/MAX CRM

A web-based client database for RE/MAX real estate agents. Agents manage their own client and property records; admins can view all agency data and manage agent accounts.

## Features

- **Agent accounts** — create, edit, and delete your own client records
- **Client fields** — name, phone, address, property type, bedrooms, bathrooms, size (m²), price (EUR), sell/rent intent, notes
- **Search & filter** — find clients by name, phone, or address; filter by intent
- **Admin dashboard** — view all clients across agents, filter by agent, create new agent accounts
- **Role-based access** — agents see only their data; admins see everything

## Tech stack

- Next.js 16 (App Router) + TypeScript
- PostgreSQL + Prisma
- NextAuth.js (credentials)
- Tailwind CSS

## Getting started

### Prerequisites

- Node.js 20+
- Docker (for local PostgreSQL)

### Setup

1. **Start the database**

```bash
docker compose up -d
```

2. **Configure environment**

```bash
cp .env.example .env
```

3. **Install dependencies**

```bash
npm install
```

4. **Run migrations and seed**

```bash
npx prisma migrate dev
npx prisma db seed
```

5. **Start the dev server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo accounts

| Role  | Email             | Password  |
|-------|-------------------|-----------|
| Admin | admin@remax.com   | admin123  |
| Agent | agent@remax.com   | agent123  |

## Project structure

```
src/
├── actions/        # Server actions (clients, users, auth)
├── app/            # Next.js pages and layouts
├── components/     # UI components
└── lib/            # Auth, database, validations
prisma/
├── schema.prisma   # Database schema
└── seed.ts         # Demo data
```

## Deploy to Railway

This project is configured for [Railway](https://railway.app).

### 1. Push to GitHub

The repo should be on GitHub (see below). In Railway: **New Project → Deploy from GitHub repo** and select this repository.

### 2. Add PostgreSQL

In your Railway project, click **+ New → Database → PostgreSQL**. Railway will create a `DATABASE_URL` variable automatically.

### 3. Set environment variables

On your **web service** (not the database), add these variables:

| Variable       | Value |
|----------------|-------|
| `DATABASE_URL` | Reference from the PostgreSQL service (`${{Postgres.DATABASE_URL}}`) |
| `AUTH_SECRET`  | Random string — run `openssl rand -base64 32` |
| `AUTH_URL`     | Your Railway public URL, e.g. `https://your-app.up.railway.app` |

### 4. Deploy

Railway will run `npm run build` (includes Prisma migrations) and start the app.

### 5. Seed the database (first time only)

After the first successful deploy, open the Railway **web service → Settings → Run command** (or use the CLI):

```bash
npx prisma db seed
```

This creates the admin and agent demo accounts.

### Generate a public URL

In Railway: **web service → Settings → Networking → Generate Domain**.

## Deployment (other platforms)

For production, set `DATABASE_URL` to a hosted PostgreSQL instance and generate a secure `AUTH_SECRET`:

```bash
openssl rand -base64 32
```
