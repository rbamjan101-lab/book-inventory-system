from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from .. import crud, schemas

router = APIRouter(prefix="/vendors", tags=["vendors"])


@router.get("/", response_model=schemas.PaginatedVendors)
def list_vendors(
        skip: int = Query(0, ge=0),
        limit: int = Query(20, ge=1, le=100),
        q: Optional[str] = Query(None, description="Search by vendor name"),
        db: Session = Depends(get_db),
):
        items, total = crud.list_vendors(db, skip=skip, limit=limit, q=q)
        return schemas.PaginatedVendors(items=items, total=total, skip=skip, limit=limit)


@router.post("/", response_model=schemas.Vendor, status_code=201)
def create_vendor(payload: schemas.VendorCreate, db: Session = Depends(get_db)):
        existing = crud.get_vendor_by_name(db, payload.name)
        if existing:
                raise HTTPException(status_code=400, detail="Vendor name already exists")
        return crud.create_vendor(db, payload)


@router.get("/{vendor_id}", response_model=schemas.Vendor)
def get_vendor(vendor_id: int, db: Session = Depends(get_db)):
        vendor = crud.get_vendor(db, vendor_id)
        if not vendor:
                raise HTTPException(status_code=404, detail="Vendor not found")
        return vendor


@router.put("/{vendor_id}", response_model=schemas.Vendor)
def update_vendor(vendor_id: int, payload: schemas.VendorUpdate, db: Session = Depends(get_db)):
        vendor = crud.get_vendor(db, vendor_id)
        if not vendor:
                raise HTTPException(status_code=404, detail="Vendor not found")
        if payload.name:
                existing = crud.get_vendor_by_name(db, payload.name)
                if existing and existing.id != vendor_id:
                        raise HTTPException(status_code=400, detail="Vendor name already exists")
        return crud.update_vendor(db, vendor, payload)


@router.delete("/{vendor_id}", status_code=204)
def delete_vendor(vendor_id: int, db: Session = Depends(get_db)):
        vendor = crud.get_vendor(db, vendor_id)
        if not vendor:
                raise HTTPException(status_code=404, detail="Vendor not found")
        try:
                crud.delete_vendor(db, vendor)
        except ValueError as exc:
                raise HTTPException(status_code=400, detail=str(exc)) from exc
        return None
