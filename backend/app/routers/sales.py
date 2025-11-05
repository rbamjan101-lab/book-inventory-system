from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from .. import crud, schemas

router = APIRouter(prefix="/sales", tags=["sales"])


@router.get("/", response_model=schemas.PaginatedSales)
def list_sales(
        skip: int = Query(0, ge=0),
        limit: int = Query(20, ge=1, le=100),
        customer_id: Optional[int] = Query(None, description="Filter by customer ID"),
        book_id: Optional[int] = Query(None, description="Filter by book ID"),
        db: Session = Depends(get_db),
):
        items, total = crud.list_sales(db, skip=skip, limit=limit, customer_id=customer_id, book_id=book_id)
        return schemas.PaginatedSales(items=items, total=total, skip=skip, limit=limit)


@router.post("/", response_model=schemas.Sale, status_code=201)
def create_sale(payload: schemas.SaleCreate, db: Session = Depends(get_db)):
        customer = crud.get_customer(db, payload.customer_id)
        if not customer:
                raise HTTPException(status_code=404, detail="Customer not found")
        book = crud.get_book(db, payload.book_id)
        if not book:
                raise HTTPException(status_code=404, detail="Book not found")
        try:
                return crud.create_sale(db, customer=customer, book=book, sale_in=payload)
        except ValueError as exc:
                raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/{sale_id}", response_model=schemas.Sale)
def get_sale(sale_id: int, db: Session = Depends(get_db)):
        sale = crud.get_sale(db, sale_id)
        if not sale:
                raise HTTPException(status_code=404, detail="Sale not found")
        return sale
