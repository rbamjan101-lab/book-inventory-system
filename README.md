# Book Inventory - FastAPI + Next.js

Full-stack inventory management system for books.

- Backend: FastAPI, SQLAlchemy, SQLite
- Frontend: Next.js (App Router), Tailwind CSS

## Prerequisites
- Python 3.10+
- Node.js 18+

## Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
# Run with uvicorn (explicit host for demos)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
# or via the module entrypoint
python -m app
```

API docs available at `http://localhost:8000/docs`.

Environment:
- `DATABASE_URL` (optional, default: `sqlite:///./inventory.db`)

## Frontend (Next.js)

```bash
cd frontend
npm install
# set API base if different from default
# echo "NEXT_PUBLIC_API_BASE=http://localhost:8000" > .env.local
npm run dev
```

Visit `http://localhost:3000`.

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
  tsconfig.json
  tailwind.config.ts
  postcss.config.js
  next.config.mjs
```

## Notes
- CORS is configured for `http://localhost:3000`.
- SQLite DB file is created at `backend/inventory.db` by default.
- For production, use a proper database and migrations (e.g., Alembic).


