from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from .. import crud, schemas

router = APIRouter(prefix="/purchases", tags=["purchases"])


@router.get("/", response_model=schemas.PaginatedPurchases)
def list_purchases(
        skip: int = Query(0, ge=0),
        limit: int = Query(20, ge=1, le=100),
        vendor_id: Optional[int] = Query(None, description="Filter by vendor ID"),
        book_id: Optional[int] = Query(None, description="Filter by book ID"),
        db: Session = Depends(get_db),
):
        items, total = crud.list_purchases(db, skip=skip, limit=limit, vendor_id=vendor_id, book_id=book_id)
        return schemas.PaginatedPurchases(items=items, total=total, skip=skip, limit=limit)


@router.post("/", response_model=schemas.Purchase, status_code=201)
def create_purchase(payload: schemas.PurchaseCreate, db: Session = Depends(get_db)):
        vendor = crud.get_vendor(db, payload.vendor_id)
        if not vendor:
                raise HTTPException(status_code=404, detail="Vendor not found")
        book = crud.get_book(db, payload.book_id)
        if not book:
                raise HTTPException(status_code=404, detail="Book not found")
        return crud.create_purchase(db, vendor=vendor, book=book, purchase_in=payload)


@router.get("/{purchase_id}", response_model=schemas.Purchase)
def get_purchase(purchase_id: int, db: Session = Depends(get_db)):
        purchase = crud.get_purchase(db, purchase_id)
        if not purchase:
                raise HTTPException(status_code=404, detail="Purchase not found")
        return purchase
