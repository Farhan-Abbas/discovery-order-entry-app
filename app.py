from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List

app = FastAPI()

# In-memory storage for orders
# This dictionary will store all orders with their unique IDs as keys
orders = {}

# Counter to generate unique order IDs
order_id_counter = 1

# Data models
class LineItem(BaseModel):
    # Represents an individual item in an order
    product_name: str = Field(..., title="Product Name", min_length=1)  # Name of the product (must not be empty)
    quantity: int = Field(..., title="Quantity", gt=0)  # Quantity of the product (must be greater than zero)

class Order(BaseModel):
    # Represents a complete sales order
    customer_name: str = Field(..., title="Customer Name", min_length=1)  # Name of the customer (must not be empty)
    line_items: List[LineItem]  # List of items included in the order


@app.get("/")
async def root():
    return {"message": "Hello World"}