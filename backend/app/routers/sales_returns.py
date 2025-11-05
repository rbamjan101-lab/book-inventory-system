from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from .. import crud, schemas

router = APIRouter(prefix="/sales-returns", tags=["sales_returns"])


@router.get("/", response_model=schemas.PaginatedSalesReturns)
def list_sales_returns(
        skip: int = Query(0, ge=0),
        limit: int = Query(20, ge=1, le=100),
        sale_id: Optional[int] = Query(None, description="Filter by sale ID"),
        db: Session = Depends(get_db),
):
        items, total = crud.list_sales_returns(db, skip=skip, limit=limit, sale_id=sale_id)
        return schemas.PaginatedSalesReturns(items=items, total=total, skip=skip, limit=limit)


@router.post("/", response_model=schemas.SalesReturn, status_code=201)
def create_sales_return(payload: schemas.SalesReturnCreate, db: Session = Depends(get_db)):
        sale = crud.get_sale(db, payload.sale_id)
        if not sale:
                raise HTTPException(status_code=404, detail="Sale not found")
        try:
                return crud.create_sales_return(db, sale=sale, sales_return_in=payload)
        except ValueError as exc:
                raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/{sales_return_id}", response_model=schemas.SalesReturn)
def get_sales_return(sales_return_id: int, db: Session = Depends(get_db)):
        sales_return = crud.get_sales_return(db, sales_return_id)
        if not sales_return:
                raise HTTPException(status_code=404, detail="Sales return not found")
        return sales_return
