from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from .. import crud, schemas

router = APIRouter(prefix="/customers", tags=["customers"])


@router.get("/", response_model=schemas.PaginatedCustomers)
def list_customers(
        skip: int = Query(0, ge=0),
        limit: int = Query(20, ge=1, le=100),
        q: Optional[str] = Query(None, description="Search by customer name"),
        category: Optional[schemas.CustomerCategory] = Query(None, description="Filter by customer category"),
        db: Session = Depends(get_db),
):
        items, total = crud.list_customers(db, skip=skip, limit=limit, q=q, category=category)
        return schemas.PaginatedCustomers(items=items, total=total, skip=skip, limit=limit)


@router.post("/", response_model=schemas.Customer, status_code=201)
def create_customer(payload: schemas.CustomerCreate, db: Session = Depends(get_db)):
        existing = crud.get_customer_by_name(db, payload.name)
        if existing:
                raise HTTPException(status_code=400, detail="Customer name already exists")
        return crud.create_customer(db, payload)


@router.get("/{customer_id}", response_model=schemas.Customer)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
        customer = crud.get_customer(db, customer_id)
        if not customer:
                raise HTTPException(status_code=404, detail="Customer not found")
        return customer


@router.put("/{customer_id}", response_model=schemas.Customer)
def update_customer(customer_id: int, payload: schemas.CustomerUpdate, db: Session = Depends(get_db)):
        customer = crud.get_customer(db, customer_id)
        if not customer:
                raise HTTPException(status_code=404, detail="Customer not found")
        if payload.name:
                existing = crud.get_customer_by_name(db, payload.name)
                if existing and existing.id != customer_id:
                        raise HTTPException(status_code=400, detail="Customer name already exists")
        return crud.update_customer(db, customer, payload)


@router.delete("/{customer_id}", status_code=204)
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
        customer = crud.get_customer(db, customer_id)
        if not customer:
                raise HTTPException(status_code=404, detail="Customer not found")
        try:
                crud.delete_customer(db, customer)
        except ValueError as exc:
                raise HTTPException(status_code=400, detail=str(exc)) from exc
        return None
