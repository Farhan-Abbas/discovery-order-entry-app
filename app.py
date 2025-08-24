from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, validator
from typing import List
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.requests import Request
from fastapi.middleware.cors import CORSMiddleware
import re

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for orders
# This dictionary will store all orders with their unique IDs as keys
orders = {}

# Counter to generate unique order IDs
order_id_counter = 1

# Data models
class OrderItem(BaseModel):
    """
    Represents an individual item in an order.

    Attributes:
        product_name (str): The name of the product (must not be empty).
        quantity (int): The quantity of the product (must be greater than zero).
    """
    product_name: str = Field(..., title="Product Name", min_length=1)  # Name of the product (must not be empty)
    quantity: int = Field(..., title="Quantity", gt=0)  # Quantity of the product (must be greater than zero)

    @validator("product_name")
    def validate_product_name(cls, value):
        """
        Validate the product name to ensure it is not empty and contains only valid characters.

        Args:
            value (str): The product name to validate.

        Returns:
            str: The validated product name.

        Raises:
            ValueError: If the product name is invalid.
        """
        if not value.strip():
            raise ValueError("Product name cannot be empty or whitespace.")
        if not re.match(r"^[a-zA-Z0-9 ]+$", value):
            raise ValueError("Product name can only contain alphanumeric characters and spaces.")
        return value

class Order(BaseModel):
    """
    Represents a complete sales order.

    Attributes:
        customer_name (str): The name of the customer (must not be empty).
        order_items (List[OrderItem]): A list of items included in the order.
    """
    customer_name: str = Field(..., title="Customer Name", min_length=1)  # Name of the customer (must not be empty)
    order_items: List[OrderItem]  # List of items included in the order

    @validator("customer_name")
    def validate_customer_name(cls, value):
        """
        Validate the customer name to ensure it is not empty and contains only valid characters.

        Args:
            value (str): The customer name to validate.

        Returns:
            str: The validated customer name.

        Raises:
            ValueError: If the customer name is invalid.
        """
        if not value.strip():
            raise ValueError("Customer name cannot be empty or whitespace.")
        if not re.match(r"^[a-zA-Z ]+$", value):
            raise ValueError("Customer name can only contain alphabetic characters and spaces.")
        return value

    @validator("order_items")
    def validate_order_items(cls, items):
        """
        Validate the list of order items to ensure no duplicates and valid quantities.

        Args:
            items (List[OrderItem]): The list of order items to validate.

        Returns:
            List[OrderItem]: The validated list of order items.

        Raises:
            ValueError: If the order items are invalid.
        """
        if len(items) > 100:
            raise ValueError("You cannot add more than 100 line items.")

        product_names = set()
        total_quantity = 0

        for item in items:
            # Check for duplicate product names
            if item.product_name in product_names:
                raise ValueError(f"Duplicate product name detected: '{item.product_name}'.")
            product_names.add(item.product_name)

            # Accumulate total quantity
            total_quantity += item.quantity

        # Check total order quantity
        if total_quantity > 1000000:
            raise ValueError("The total quantity for the order cannot exceed 1,000,000.")

        return items

# Initialize Jinja2 templates
templates = Jinja2Templates(directory="templates")

# Utility functions
def generate_order_confirmation(order_id: int, order: Order) -> str:
    """
    Generate an HTML string for order confirmation.

    Args:
        order_id (int): The unique ID of the order.
        order (Order): The order object containing customer and item details.

    Returns:
        str: HTML string for the order confirmation page.
    """
    return f"""
    <h1>Order Confirmation</h1>
    <p>Order ID: {order_id}</p>
    <p>Customer Name: {order.customer_name}</p>
    <h3>Order Items:</h3>
    <ul>
        {''.join(f'<li>{item.product_name} - Quantity: {item.quantity}</li>' for item in order.order_items)}
    </ul>
    """

def generate_error_response(detail: str) -> HTMLResponse:
    """
    Generate an HTML response for errors.

    Args:
        detail (str): The error message to display.

    Returns:
        HTMLResponse: HTML response containing the error message.
    """
    return HTMLResponse(content=f"<h1>Error</h1><p>{detail}</p>", status_code=400)

# Routes
@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    """
    Root endpoint to serve the HTML form for the user.

    Args:
        request (Request): The incoming HTTP request.

    Returns:
        TemplateResponse: The rendered HTML form.
    """
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/order", response_class=HTMLResponse)
async def create_order(order: Order, request: Request):
    """
    Endpoint to create a new order.
    Validates the input data and stores the order in the in-memory storage.
    Returns an HTML response for order confirmation or error.

    Args:
        order (Order): The order data submitted by the user.
        request (Request): The incoming HTTP request.

    Returns:
        HTMLResponse: The HTML response for order confirmation or error.
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

        # Use utility function to generate confirmation HTML
        return generate_order_confirmation(order_id, order)

    except HTTPException as http_exc:
        # Use utility function to generate error HTML
        return generate_error_response(http_exc.detail)

    except Exception as exc:
        # Render a generic error HTML dynamically
        return HTMLResponse(
            content=f"<h1>Error</h1><p>An unexpected error occurred: {str(exc)}</p>",
            status_code=500,
        )