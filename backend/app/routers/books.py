from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from .. import crud, schemas, models


router = APIRouter(prefix="/books", tags=["books"])


@router.get("/", response_model=schemas.PaginatedBooks)
def list_books(
	skip: int = Query(0, ge=0),
	limit: int = Query(20, ge=1, le=100),
	q: Optional[str] = Query(None, description="Search by title, author, or ISBN"),
	db: Session = Depends(get_db),
):
	items, total = crud.list_books(db, skip=skip, limit=limit, q=q)
	return schemas.PaginatedBooks(items=items, total=total, skip=skip, limit=limit)


@router.post("/", response_model=schemas.Book, status_code=201)
def create_book(payload: schemas.BookCreate, db: Session = Depends(get_db)):
	if payload.isbn:
		existing = crud.get_book_by_isbn(db, payload.isbn)
		if existing:
			raise HTTPException(status_code=400, detail="ISBN already exists")
	return crud.create_book(db, payload)


@router.get("/{book_id}", response_model=schemas.Book)
def get_book(book_id: int, db: Session = Depends(get_db)):
	book = crud.get_book(db, book_id)
	if not book:
		raise HTTPException(status_code=404, detail="Book not found")
	return book


@router.put("/{book_id}", response_model=schemas.Book)
def update_book(book_id: int, payload: schemas.BookUpdate, db: Session = Depends(get_db)):
	book = crud.get_book(db, book_id)
	if not book:
		raise HTTPException(status_code=404, detail="Book not found")
	if payload.isbn:
		existing = crud.get_book_by_isbn(db, payload.isbn)
		if existing and existing.id != book_id:
			raise HTTPException(status_code=400, detail="ISBN already exists")
	return crud.update_book(db, book, payload)


@router.delete("/{book_id}", status_code=204)
def delete_book(book_id: int, db: Session = Depends(get_db)):
	book = crud.get_book(db, book_id)
	if not book:
		raise HTTPException(status_code=404, detail="Book not found")
	crud.delete_book(db, book)
	return None


