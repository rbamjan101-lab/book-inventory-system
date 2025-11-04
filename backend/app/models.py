from sqlalchemy import Column, Integer, String, DateTime, Numeric
from sqlalchemy.sql import func

from .database import Base


class Book(Base):
	__tablename__ = "books"

	id = Column(Integer, primary_key=True, index=True)
	title = Column(String(255), nullable=False, index=True)
	author = Column(String(255), nullable=False, index=True)
	isbn = Column(String(64), unique=True, nullable=True, index=True)
	quantity = Column(Integer, nullable=False, default=0)
	price = Column(Numeric(10, 2), nullable=False, default=0)
	created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
	updated_at = Column(
		DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
	)


