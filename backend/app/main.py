import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import books, vendors, customers, purchases, sales, sales_returns


def _cors_origins() -> list[str]:
	default = "http://localhost:3000,http://127.0.0.1:3000"
	raw = os.getenv("CORS_ORIGINS", default)
	return [origin.strip() for origin in raw.split(",") if origin.strip()]


def create_app() -> FastAPI:
    app = FastAPI(title="Book Inventory API", version="1.0.0")

origins = _cors_origins()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(books.router)
app.include_router(vendors.router)
app.include_router(customers.router)
app.include_router(purchases.router)
app.include_router(sales.router)
app.include_router(sales_returns.router)

    @app.get("/health")
    def health():
        return {"status": "ok"}

    return app


# Create tables if not exist on startup (simple approach without Alembic)
Base.metadata.create_all(bind=engine)

app = create_app()


