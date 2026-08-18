from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import NullPool
import os


def _normalize_database_url(url: str) -> str:
	# Heroku/Supabase sometimes provide postgres://; SQLAlchemy requires postgresql://
	if url.startswith("postgres://"):
		url = url.replace("postgres://", "postgresql://", 1)
	return url


DATABASE_URL = _normalize_database_url(
	os.getenv("DATABASE_URL", "sqlite:///./inventory.db")
)

_engine_kwargs: dict = {}

if DATABASE_URL.startswith("sqlite"):
	_engine_kwargs["connect_args"] = {"check_same_thread": False}
elif DATABASE_URL.startswith("postgresql"):
	# Supabase requires SSL; pool_pre_ping keeps connections healthy across deploys
	_engine_kwargs["connect_args"] = {"sslmode": "require"}
	_engine_kwargs["pool_pre_ping"] = True
	# Supabase pooler (port 6543) works best with NullPool for serverless-style hosts
	if ":6543" in DATABASE_URL or "pooler.supabase.com" in DATABASE_URL:
		_engine_kwargs["poolclass"] = NullPool

engine = create_engine(DATABASE_URL, **_engine_kwargs)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
	db = SessionLocal()
	try:
		yield db
	finally:
		db.close()
