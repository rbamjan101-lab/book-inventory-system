from typing import Optional, List, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from . import models, schemas


def create_book(db: Session, book_in: schemas.BookCreate) -> models.Book:
	book = models.Book(
		title=book_in.title,
		author=book_in.author,
		isbn=book_in.isbn,
		quantity=book_in.quantity,
		price=book_in.price,
	)
	db.add(book)
	db.commit()
	db.refresh(book)
	return book


def get_book(db: Session, book_id: int) -> Optional[models.Book]:
	return db.get(models.Book, book_id)


def get_book_by_isbn(db: Session, isbn: str) -> Optional[models.Book]:
	stmt = select(models.Book).where(models.Book.isbn == isbn)
	return db.scalars(stmt).first()


def list_books(
	db: Session,
	skip: int = 0,
	limit: int = 20,
	q: Optional[str] = None,
) -> Tuple[List[models.Book], int]:
	stmt = select(models.Book)
	count_stmt = select(func.count()).select_from(models.Book)
	if q:
		pattern = f"%{q}%"
		stmt = stmt.where(
			(models.Book.title.ilike(pattern)) | (models.Book.author.ilike(pattern)) | (models.Book.isbn.ilike(pattern))
		)
		count_stmt = count_stmt.where(
			(models.Book.title.ilike(pattern)) | (models.Book.author.ilike(pattern)) | (models.Book.isbn.ilike(pattern))
		)
	stmt = stmt.offset(skip).limit(limit).order_by(models.Book.created_at.desc())
	items = list(db.scalars(stmt).all())
	total = db.execute(count_stmt).scalar_one()
	return items, int(total)


def update_book(db: Session, book: models.Book, book_in: schemas.BookUpdate) -> models.Book:
	data = book_in.model_dump(exclude_unset=True)
	for key, value in data.items():
		setattr(book, key, value)
	db.add(book)
	db.commit()
	db.refresh(book)
	return book


def delete_book(db: Session, book: models.Book) -> None:
	db.delete(book)
	db.commit()


