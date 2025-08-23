from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, validator
from typing import List
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.requests import Request
import re

app = FastAPI()

# In-memory storage for orders
# This dictionary will store all orders with their unique IDs as keys
orders = {}

# Counter to generate unique order IDs
order_id_counter = 1

# Data models
class OrderItem(BaseModel):
    # Represents an individual item in an order
    product_name: str = Field(..., title="Product Name", min_length=1)  # Name of the product (must not be empty)
    quantity: int = Field(..., title="Quantity", gt=0)  # Quantity of the product (must be greater than zero)

    @validator("product_name")
    def validate_product_name(cls, value):
        if not value.strip():
            raise ValueError("Product name cannot be empty or whitespace.")
        if not re.match(r"^[a-zA-Z0-9 ]+$", value):
            raise ValueError("Product name can only contain alphanumeric characters and spaces.")
        return value

class Order(BaseModel):
    # Represents a complete sales order
    customer_name: str = Field(..., title="Customer Name", min_length=1)  # Name of the customer (must not be empty)
    order_items: List[OrderItem]  # List of items included in the order

    @validator("customer_name")
    def validate_customer_name(cls, value):
        if not value.strip():
            raise ValueError("Customer name cannot be empty or whitespace.")
        if not re.match(r"^[a-zA-Z ]+$", value):
            raise ValueError("Customer name can only contain alphabetic characters and spaces.")
        return value

# Initialize Jinja2 templates
templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    """
    Root endpoint to serve the HTML form for the user.
    """
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/order", response_class=HTMLResponse)
async def create_order(order: Order, request: Request):
    """
    Endpoint to create a new order.
    Validates the input data and stores the order in the in-memory storage.
    Returns an HTML response for order confirmation or error.
    """
    global order_id_counter

    try:
        # Validate that the order has at least one order item
        if not order.order_items:
            raise HTTPException(status_code=400, detail="Order must have at least one order item.")

        # Assign a unique ID to the order and store it in the in-memory dictionary
        order_id = order_id_counter
        orders[order_id] = order
        order_id_counter += 1

        # Render the confirmation HTML template
        return templates.TemplateResponse(
            "confirmation.html",
            {
                "request": request,
                "order_id": order_id,
                "customer_name": order.customer_name,
                "order_items": order.order_items,
            },
        )

    except HTTPException as http_exc:
        # Render an error HTML template for HTTP exceptions
        return templates.TemplateResponse(
            "error.html",
            {"request": request, "error_message": http_exc.detail},
            status_code=http_exc.status_code,
        )

    except Exception as exc:
        # Render a generic error HTML template for unexpected errors
        return templates.TemplateResponse(
            "error.html",
            {
                "request": request,
                "error_message": "An unexpected error occurred.",
                "details": str(exc),
            },
            status_code=500,
        )