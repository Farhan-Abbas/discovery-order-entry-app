from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.requests import Request

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

# Initialize Jinja2 templates
templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    """
    Root endpoint to serve the HTML form for the user.
    """
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/order")
async def create_order(order: Order):
    """
    Endpoint to create a new order.
    Validates the input data and stores the order in the in-memory storage.
    """
    global order_id_counter

    # Validate that the order has at least one line item
    if not order.line_items:
        raise HTTPException(status_code=400, detail="Order must have at least one line item.")

    # Assign a unique ID to the order and store it in the in-memory dictionary
    order_id = order_id_counter
    orders[order_id] = order
    order_id_counter += 1

    return {"order_id": order_id, "message": "Order created successfully."}