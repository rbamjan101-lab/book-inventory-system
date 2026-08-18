# Book Inventory - FastAPI + Next.js

Full-stack inventory management system for books.

- Backend: FastAPI, SQLAlchemy, PostgreSQL (Supabase)
- Frontend: Next.js (App Router), Tailwind CSS

## Prerequisites
- Python 3.10+
- Node.js 18+
- [Supabase](https://supabase.com) account (production database)
- [Vercel](https://vercel.com) account (frontend hosting)
- [Render](https://render.com) account (backend hosting — free tier available)

## Local Development

### 1. Supabase (optional for local dev)

For local development you can use SQLite (default). To use Supabase locally:

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Run the schema in **SQL Editor**:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
3. Copy the **Transaction pooler** connection string from **Project Settings → Database**

### 2. Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
cp .env.example .env       # edit DATABASE_URL if using Supabase
uvicorn app.main:app --reload --port 8000
```

API docs: `http://localhost:8000/docs`

Environment variables (see `backend/.env.example`):

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (Supabase) or omit for SQLite |
| `CORS_ORIGINS` | Comma-separated frontend URLs allowed by CORS |

### 3. Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Visit `http://localhost:3000`.

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_BASE` | FastAPI backend URL (default: `http://localhost:8000`) |

---

## Production Deployment

Architecture: **Vercel** (frontend) + **Render** (backend) + **Supabase** (database).

```
Browser → Vercel (Next.js) → Render (FastAPI) → Supabase (PostgreSQL)
```

### Step 1: Supabase Database

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Open **SQL Editor** and run `supabase/migrations/001_initial_schema.sql`
3. Go to **Project Settings → Database → Connection string**
4. Copy the **Transaction pooler** URI (port `6543`) — required for serverless/pooled connections
5. Replace `[YOUR-PASSWORD]` with your database password

### Step 2: Deploy Backend (Render)

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New → Blueprint**
3. Connect your repo — Render reads `render.yaml` automatically
4. Set environment variables when prompted:
   - `DATABASE_URL` — Supabase Transaction pooler URI
   - `CORS_ORIGINS` — your Vercel URL (set after Step 3), e.g. `https://your-app.vercel.app`
5. Deploy and note the service URL, e.g. `https://inventory-api.onrender.com`

> Tables are also auto-created on first startup via SQLAlchemy if you skip the migration, but running the SQL migration is recommended.

### Step 3: Deploy Frontend (Vercel)

1. Go to [vercel.com/new](https://vercel.com/new) → import your GitHub repo
2. Set **Root Directory** to `frontend`
3. Add environment variable:
   - `NEXT_PUBLIC_API_BASE` = your Render backend URL (e.g. `https://inventory-api.onrender.com`)
4. Deploy

### Step 4: Finalize CORS

After Vercel gives you a production URL, update `CORS_ORIGINS` on Render:

```
CORS_ORIGINS=https://your-app.vercel.app,http://localhost:3000
```

Redeploy the Render service (or it will pick up the env change automatically).

---

## Features
- Create, read, update, delete books
- Search by title, author, or ISBN
- Pagination
- Client and server validation

## Project Structure
```
backend/
  app/
    main.py
    database.py
    models.py
    schemas.py
    crud.py
    routers/
      books.py
  requirements.txt
  runtime.txt
  .env.example
frontend/
  app/
    layout.tsx
    page.tsx
    books/
      new/page.tsx
      [id]/page.tsx
  components/
    BookForm.tsx
  lib/
    api.ts
  styles/
    globals.css
  package.json
  vercel.json
  .env.example
supabase/
  migrations/
    001_initial_schema.sql
render.yaml
```

## Notes
- CORS origins are configured via the `CORS_ORIGINS` env var.
- Local dev uses SQLite by default (`backend/inventory.db`).
- Production uses Supabase PostgreSQL via the Transaction pooler (port 6543).
- Vercel hosts the Next.js frontend only; the FastAPI backend runs on Render.
