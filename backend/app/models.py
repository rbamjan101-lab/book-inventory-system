from enum import Enum as PyEnum
from sqlalchemy import Column, Integer, String, DateTime, Numeric, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base


class Book(Base):
        __tablename__ = "books"

        id = Column(Integer, primary_key=True, index=True)
        title = Column(String(255), nullable=False, index=True)
        author = Column(String(255), nullable=False, index=True)
        isbn = Column(String(64), unique=True, nullable=True, index=True)
        quantity = Column(Integer, nullable=False, default=0)
        price = Column(Numeric(10, 2), nullable=False, default=0)
        created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
        updated_at = Column(
                DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
        )

        purchases = relationship("Purchase", back_populates="book", cascade="all, delete-orphan")
        sales = relationship("Sale", back_populates="book", cascade="all, delete-orphan")


class CustomerCategory(PyEnum):
        SCHOOL = "school"
        STATIONERY_SHOP = "stationery_shop"
        DEALER = "dealer"


class Vendor(Base):
        __tablename__ = "vendors"

        id = Column(Integer, primary_key=True, index=True)
        name = Column(String(255), nullable=False, unique=True, index=True)
        contact_address = Column(String(512), nullable=True)
        contact_person = Column(String(255), nullable=True)
        contact_number = Column(String(64), nullable=True)
        email = Column(String(255), nullable=True)
        tax_number = Column(String(64), nullable=True)
        created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
        updated_at = Column(
                DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
        )

        purchases = relationship("Purchase", back_populates="vendor", cascade="all, delete-orphan")


class Customer(Base):
        __tablename__ = "customers"

        id = Column(Integer, primary_key=True, index=True)
        name = Column(String(255), nullable=False, unique=True, index=True)
        contact_address = Column(String(512), nullable=True)
        contact_person = Column(String(255), nullable=True)
        contact_number = Column(String(64), nullable=True)
        email = Column(String(255), nullable=True)
        tax_number = Column(String(64), nullable=True)
        category = Column(Enum(CustomerCategory), nullable=False)
        created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
        updated_at = Column(
                DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
        )

        sales = relationship("Sale", back_populates="customer", cascade="all, delete-orphan")


class Purchase(Base):
        __tablename__ = "purchases"

        id = Column(Integer, primary_key=True, index=True)
        vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=False, index=True)
        book_id = Column(Integer, ForeignKey("books.id"), nullable=False, index=True)
        quantity = Column(Integer, nullable=False)
        unit_cost = Column(Numeric(10, 2), nullable=False)
        total_cost = Column(Numeric(12, 2), nullable=False)
        purchased_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
        notes = Column(String(512), nullable=True)
        created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
        updated_at = Column(
                DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
        )

        vendor = relationship("Vendor", back_populates="purchases")
        book = relationship("Book", back_populates="purchases")


class Sale(Base):
        __tablename__ = "sales"

        id = Column(Integer, primary_key=True, index=True)
        customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False, index=True)
        book_id = Column(Integer, ForeignKey("books.id"), nullable=False, index=True)
        quantity = Column(Integer, nullable=False)
        unit_price = Column(Numeric(10, 2), nullable=False)
        total_amount = Column(Numeric(12, 2), nullable=False)
        sold_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
        notes = Column(String(512), nullable=True)
        created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
        updated_at = Column(
                DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
        )

        customer = relationship("Customer", back_populates="sales")
        book = relationship("Book", back_populates="sales")
        returns = relationship("SalesReturn", back_populates="sale", cascade="all, delete-orphan")


class SalesReturn(Base):
        __tablename__ = "sales_returns"

        id = Column(Integer, primary_key=True, index=True)
        sale_id = Column(Integer, ForeignKey("sales.id"), nullable=False, index=True)
        quantity = Column(Integer, nullable=False)
        reason = Column(String(512), nullable=True)
        processed_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
        created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
        updated_at = Column(
                DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
        )

        sale = relationship("Sale", back_populates="returns")


