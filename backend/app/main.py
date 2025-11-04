from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import books


def create_app() -> FastAPI:
	app = FastAPI(title="Book Inventory API", version="1.0.0")

	# CORS for local dev frontend
	origins = [
		"http://localhost:3000",
		"http://127.0.0.1:3000",
	]
	app.add_middleware(
		CORSMiddleware,
		allow_origins=origins,
		allow_credentials=True,
		allow_methods=["*"],
		allow_headers=["*"],
	)

	app.include_router(books.router)

	@app.get("/health")
	def health():
		return {"status": "ok"}

	return app


# Create tables if not exist on startup (simple approach without Alembic)
Base.metadata.create_all(bind=engine)

app = create_app()


