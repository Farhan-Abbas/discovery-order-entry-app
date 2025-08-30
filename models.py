from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime

class OrderItemTable(SQLModel, table=True):
    """Database table for order items"""
    __tablename__ = "order_items"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    product_name: str = Field(index=True)
    quantity: int
    order_id: int = Field(foreign_key="orders.id")
    
    # Relationship
    order: "OrderTable" = Relationship(back_populates="order_items")

class OrderTable(SQLModel, table=True):
    """Database table for orders"""
    __tablename__ = "orders"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    customer_name: str = Field(index=True)
    currency: str = Field(default="CAD")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationship
    order_items: List[OrderItemTable] = Relationship(back_populates="order")

# Request/Response models (these inherit from the table models but can be customized)
class OrderItemCreate(SQLModel):
    """Model for creating order items"""
    product_name: str
    quantity: int

class OrderItemRead(SQLModel):
    """Model for reading order items"""
    id: int
    product_name: str
    quantity: int
    order_id: int

class OrderCreate(SQLModel):
    """Model for creating orders"""
    customer_name: str
    currency: str = "CAD"
    order_items: List[OrderItemCreate]

class OrderRead(SQLModel):
    """Model for reading orders"""
    id: int
    customer_name: str
    currency: str
    created_at: datetime
    order_items: List[OrderItemRead]
