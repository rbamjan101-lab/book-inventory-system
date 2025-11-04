from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class BookBase(BaseModel):
	title: str = Field(..., min_length=1, max_length=255)
	author: str = Field(..., min_length=1, max_length=255)
	isbn: Optional[str] = Field(None, max_length=64)
	quantity: int = Field(..., ge=0)
	price: float = Field(0, ge=0)


class BookCreate(BookBase):
	pass



class BookUpdate(BaseModel):
	title: Optional[str] = Field(None, min_length=1, max_length=255)
	author: Optional[str] = Field(None, min_length=1, max_length=255)
	isbn: Optional[str] = Field(None, max_length=64)
	quantity: Optional[int] = Field(None, ge=0)
	price: Optional[float] = Field(None, ge=0)


class Book(BookBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PaginatedBooks(BaseModel):
	items: List[Book]
	total: int
	skip: int
	limit: int


