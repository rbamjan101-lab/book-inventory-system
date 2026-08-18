from typing import Optional, List
from datetime import datetime
from enum import Enum
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


class VendorBase(BaseModel):
        name: str = Field(..., min_length=1, max_length=255)
        contact_address: Optional[str] = Field(None, max_length=512)
        contact_person: Optional[str] = Field(None, max_length=255)
        contact_number: Optional[str] = Field(None, max_length=64)
        email: Optional[str] = Field(None, max_length=255)
        tax_number: Optional[str] = Field(None, max_length=64)


class VendorCreate(VendorBase):
        pass


class VendorUpdate(BaseModel):
        name: Optional[str] = Field(None, min_length=1, max_length=255)
        contact_address: Optional[str] = Field(None, max_length=512)
        contact_person: Optional[str] = Field(None, max_length=255)
        contact_number: Optional[str] = Field(None, max_length=64)
        email: Optional[str] = Field(None, max_length=255)
        tax_number: Optional[str] = Field(None, max_length=64)


class Vendor(VendorBase):
        id: int
        created_at: datetime
        updated_at: datetime

        class Config:
                from_attributes = True


class PaginatedVendors(BaseModel):
        items: List[Vendor]
        total: int
        skip: int
        limit: int


class CustomerCategory(str, Enum):
        SCHOOL = "school"
        STATIONERY_SHOP = "stationery_shop"
        DEALER = "dealer"


class CustomerBase(BaseModel):
        name: str = Field(..., min_length=1, max_length=255)
        contact_address: Optional[str] = Field(None, max_length=512)
        contact_person: Optional[str] = Field(None, max_length=255)
        contact_number: Optional[str] = Field(None, max_length=64)
        email: Optional[str] = Field(None, max_length=255)
        tax_number: Optional[str] = Field(None, max_length=64)
        category: CustomerCategory


class CustomerCreate(CustomerBase):
        pass


class CustomerUpdate(BaseModel):
        name: Optional[str] = Field(None, min_length=1, max_length=255)
        contact_address: Optional[str] = Field(None, max_length=512)
        contact_person: Optional[str] = Field(None, max_length=255)
        contact_number: Optional[str] = Field(None, max_length=64)
        email: Optional[str] = Field(None, max_length=255)
        tax_number: Optional[str] = Field(None, max_length=64)
        category: Optional[CustomerCategory]


class Customer(CustomerBase):
        id: int
        created_at: datetime
        updated_at: datetime

        class Config:
                from_attributes = True


class PaginatedCustomers(BaseModel):
        items: List[Customer]
        total: int
        skip: int
        limit: int


class PurchaseBase(BaseModel):
        vendor_id: int
        book_id: int
        quantity: int = Field(..., ge=1)
        unit_cost: float = Field(..., ge=0)
        purchased_at: Optional[datetime] = None
        notes: Optional[str] = Field(None, max_length=512)


class PurchaseCreate(PurchaseBase):
        pass


class Purchase(PurchaseBase):
        id: int
        total_cost: float
        created_at: datetime
        updated_at: datetime
        vendor: Optional[Vendor]
        book: Optional[Book]

        class Config:
                from_attributes = True


class PaginatedPurchases(BaseModel):
        items: List[Purchase]
        total: int
        skip: int
        limit: int


class SaleBase(BaseModel):
        customer_id: int
        book_id: int
        quantity: int = Field(..., ge=1)
        unit_price: float = Field(..., ge=0)
        sold_at: Optional[datetime] = None
        notes: Optional[str] = Field(None, max_length=512)


class SaleCreate(SaleBase):
        pass


class Sale(SaleBase):
        id: int
        total_amount: float
        created_at: datetime
        updated_at: datetime
        customer: Optional[Customer]
        book: Optional[Book]

        class Config:
                from_attributes = True


class PaginatedSales(BaseModel):
        items: List[Sale]
        total: int
        skip: int
        limit: int


class SalesReturnBase(BaseModel):
        sale_id: int
        quantity: int = Field(..., ge=1)
        reason: Optional[str] = Field(None, max_length=512)


class SalesReturnCreate(SalesReturnBase):
        pass


class SalesReturn(SalesReturnBase):
        id: int
        processed_at: datetime
        created_at: datetime
        updated_at: datetime
        sale: Optional[Sale]

        class Config:
                from_attributes = True


class PaginatedSalesReturns(BaseModel):
        items: List[SalesReturn]
        total: int
        skip: int
        limit: int


