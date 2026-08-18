from typing import Optional, List, Tuple
from decimal import Decimal
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select, func

from .models import CustomerCategory

from . import models, schemas


def _to_decimal(value: float) -> Decimal:
        return Decimal(str(value))


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


def create_vendor(db: Session, vendor_in: schemas.VendorCreate) -> models.Vendor:
        vendor = models.Vendor(**vendor_in.model_dump())
        db.add(vendor)
        db.commit()
        db.refresh(vendor)
        return vendor


def get_vendor(db: Session, vendor_id: int) -> Optional[models.Vendor]:
        return db.get(models.Vendor, vendor_id)


def get_vendor_by_name(db: Session, name: str) -> Optional[models.Vendor]:
        stmt = select(models.Vendor).where(models.Vendor.name == name)
        return db.scalars(stmt).first()


def list_vendors(
        db: Session,
        skip: int = 0,
        limit: int = 20,
        q: Optional[str] = None,
) -> Tuple[List[models.Vendor], int]:
        stmt = select(models.Vendor)
        count_stmt = select(func.count()).select_from(models.Vendor)
        if q:
                pattern = f"%{q}%"
                stmt = stmt.where(models.Vendor.name.ilike(pattern))
                count_stmt = count_stmt.where(models.Vendor.name.ilike(pattern))
        stmt = stmt.order_by(models.Vendor.created_at.desc()).offset(skip).limit(limit)
        items = list(db.scalars(stmt).all())
        total = db.execute(count_stmt).scalar_one()
        return items, int(total)


def update_vendor(db: Session, vendor: models.Vendor, vendor_in: schemas.VendorUpdate) -> models.Vendor:
        data = vendor_in.model_dump(exclude_unset=True)
        for key, value in data.items():
                setattr(vendor, key, value)
        db.add(vendor)
        db.commit()
        db.refresh(vendor)
        return vendor


def delete_vendor(db: Session, vendor: models.Vendor) -> None:
        has_purchases = (
                db.execute(
                        select(func.count()).select_from(models.Purchase).where(models.Purchase.vendor_id == vendor.id)
                ).scalar_one()
                > 0
        )
        if has_purchases:
                raise ValueError("Cannot delete vendor with existing purchase records")
        db.delete(vendor)
        db.commit()


def create_customer(db: Session, customer_in: schemas.CustomerCreate) -> models.Customer:
        customer = models.Customer(**customer_in.model_dump())
        db.add(customer)
        db.commit()
        db.refresh(customer)
        return customer


def get_customer(db: Session, customer_id: int) -> Optional[models.Customer]:
        return db.get(models.Customer, customer_id)


def get_customer_by_name(db: Session, name: str) -> Optional[models.Customer]:
        stmt = select(models.Customer).where(models.Customer.name == name)
        return db.scalars(stmt).first()


def list_customers(
        db: Session,
        skip: int = 0,
        limit: int = 20,
        q: Optional[str] = None,
        category: Optional[CustomerCategory] = None,
) -> Tuple[List[models.Customer], int]:
        stmt = select(models.Customer)
        count_stmt = select(func.count()).select_from(models.Customer)
        if q:
                pattern = f"%{q}%"
                stmt = stmt.where(models.Customer.name.ilike(pattern))
                count_stmt = count_stmt.where(models.Customer.name.ilike(pattern))
        if category:
                stmt = stmt.where(models.Customer.category == category)
                count_stmt = count_stmt.where(models.Customer.category == category)
        stmt = stmt.order_by(models.Customer.created_at.desc()).offset(skip).limit(limit)
        items = list(db.scalars(stmt).all())
        total = db.execute(count_stmt).scalar_one()
        return items, int(total)


def update_customer(db: Session, customer: models.Customer, customer_in: schemas.CustomerUpdate) -> models.Customer:
        data = customer_in.model_dump(exclude_unset=True)
        for key, value in data.items():
                setattr(customer, key, value)
        db.add(customer)
        db.commit()
        db.refresh(customer)
        return customer


def delete_customer(db: Session, customer: models.Customer) -> None:
        has_sales = (
                db.execute(
                        select(func.count()).select_from(models.Sale).where(models.Sale.customer_id == customer.id)
                ).scalar_one()
                > 0
        )
        if has_sales:
                raise ValueError("Cannot delete customer with existing sales records")
        db.delete(customer)
        db.commit()


def create_purchase(
        db: Session,
        *,
        vendor: models.Vendor,
        book: models.Book,
        purchase_in: schemas.PurchaseCreate,
) -> models.Purchase:
        total_cost = _to_decimal(purchase_in.unit_cost) * purchase_in.quantity
        purchase = models.Purchase(
                vendor_id=vendor.id,
                book_id=book.id,
                quantity=purchase_in.quantity,
                unit_cost=_to_decimal(purchase_in.unit_cost),
                total_cost=total_cost,
                notes=purchase_in.notes,
        )
        if purchase_in.purchased_at:
                purchase.purchased_at = purchase_in.purchased_at
        book.quantity += purchase_in.quantity
        db.add(purchase)
        db.add(book)
        db.commit()
        db.refresh(purchase)
        db.refresh(book)
        return purchase


def get_purchase(db: Session, purchase_id: int) -> Optional[models.Purchase]:
        return db.get(models.Purchase, purchase_id)


def list_purchases(
        db: Session,
        skip: int = 0,
        limit: int = 20,
        vendor_id: Optional[int] = None,
        book_id: Optional[int] = None,
) -> Tuple[List[models.Purchase], int]:
        stmt = (
                select(models.Purchase)
                .options(
                        selectinload(models.Purchase.vendor),
                        selectinload(models.Purchase.book),
                )
                .order_by(models.Purchase.purchased_at.desc())
        )
        count_stmt = select(func.count()).select_from(models.Purchase)
        if vendor_id:
                stmt = stmt.where(models.Purchase.vendor_id == vendor_id)
                count_stmt = count_stmt.where(models.Purchase.vendor_id == vendor_id)
        if book_id:
                stmt = stmt.where(models.Purchase.book_id == book_id)
                count_stmt = count_stmt.where(models.Purchase.book_id == book_id)
        stmt = stmt.offset(skip).limit(limit)
        items = list(db.scalars(stmt).all())
        total = db.execute(count_stmt).scalar_one()
        return items, int(total)


def create_sale(
        db: Session,
        *,
        customer: models.Customer,
        book: models.Book,
        sale_in: schemas.SaleCreate,
) -> models.Sale:
        if book.quantity < sale_in.quantity:
                raise ValueError("Insufficient stock for sale")
        total_amount = _to_decimal(sale_in.unit_price) * sale_in.quantity
        sale = models.Sale(
                customer_id=customer.id,
                book_id=book.id,
                quantity=sale_in.quantity,
                unit_price=_to_decimal(sale_in.unit_price),
                total_amount=total_amount,
                notes=sale_in.notes,
        )
        if sale_in.sold_at:
                sale.sold_at = sale_in.sold_at
        book.quantity -= sale_in.quantity
        db.add(sale)
        db.add(book)
        db.commit()
        db.refresh(sale)
        db.refresh(book)
        return sale


def get_sale(db: Session, sale_id: int) -> Optional[models.Sale]:
        return db.get(models.Sale, sale_id)


def list_sales(
        db: Session,
        skip: int = 0,
        limit: int = 20,
        customer_id: Optional[int] = None,
        book_id: Optional[int] = None,
) -> Tuple[List[models.Sale], int]:
        stmt = (
                select(models.Sale)
                .options(
                        selectinload(models.Sale.customer),
                        selectinload(models.Sale.book),
                        selectinload(models.Sale.returns),
                )
                .order_by(models.Sale.sold_at.desc())
        )
        count_stmt = select(func.count()).select_from(models.Sale)
        if customer_id:
                stmt = stmt.where(models.Sale.customer_id == customer_id)
                count_stmt = count_stmt.where(models.Sale.customer_id == customer_id)
        if book_id:
                stmt = stmt.where(models.Sale.book_id == book_id)
                count_stmt = count_stmt.where(models.Sale.book_id == book_id)
        stmt = stmt.offset(skip).limit(limit)
        items = list(db.scalars(stmt).all())
        total = db.execute(count_stmt).scalar_one()
        return items, int(total)


def create_sales_return(
        db: Session,
        *,
        sale: models.Sale,
        sales_return_in: schemas.SalesReturnCreate,
) -> models.SalesReturn:
        returned_qty = (
                db.execute(
                        select(func.coalesce(func.sum(models.SalesReturn.quantity), 0)).where(
                                models.SalesReturn.sale_id == sale.id
                        )
                ).scalar_one()
        )
        if returned_qty + sales_return_in.quantity > sale.quantity:
                raise ValueError("Return quantity exceeds sold quantity")
        book = sale.book
        if book is None:
                book = db.get(models.Book, sale.book_id)
        if book is None:
                raise ValueError("Book not found for sale")
        book.quantity += sales_return_in.quantity
        sales_return = models.SalesReturn(
                sale_id=sale.id,
                quantity=sales_return_in.quantity,
                reason=sales_return_in.reason,
        )
        db.add(sales_return)
        db.add(book)
        db.commit()
        db.refresh(sales_return)
        db.refresh(book)
        return sales_return


def get_sales_return(db: Session, sales_return_id: int) -> Optional[models.SalesReturn]:
        return db.get(models.SalesReturn, sales_return_id)


def list_sales_returns(
        db: Session,
        skip: int = 0,
        limit: int = 20,
        sale_id: Optional[int] = None,
) -> Tuple[List[models.SalesReturn], int]:
        stmt = (
                select(models.SalesReturn)
                .options(
                        selectinload(models.SalesReturn.sale).selectinload(models.Sale.customer),
                        selectinload(models.SalesReturn.sale).selectinload(models.Sale.book),
                )
                .order_by(models.SalesReturn.processed_at.desc())
        )
        count_stmt = select(func.count()).select_from(models.SalesReturn)
        if sale_id:
                stmt = stmt.where(models.SalesReturn.sale_id == sale_id)
                count_stmt = count_stmt.where(models.SalesReturn.sale_id == sale_id)
        stmt = stmt.offset(skip).limit(limit)
        items = list(db.scalars(stmt).all())
        total = db.execute(count_stmt).scalar_one()
        return items, int(total)


