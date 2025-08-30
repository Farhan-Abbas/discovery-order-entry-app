from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, Field, validator
from typing import List
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.requests import Request
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
import re

# Database imports
from database import create_db_and_tables, get_session
from models import OrderTable, OrderItemTable, OrderCreate, OrderRead

app = FastAPI()

# Create database tables on startup
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Predefined products with prices in CAD (base currency)
PREDEFINED_PRODUCTS = {
    "Laptop": 1200.00,
    "Mouse": 25.00,
    "Keyboard": 75.00,
    "Monitor": 300.00,
    "Headphones": 150.00,
    "Webcam": 80.00,
    "Smartphone": 800.00,
    "Tablet": 500.00,
    "Charger": 30.00,
    "Speaker": 120.00
}

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8000", "http://127.0.0.1:5500", "http://localhost:5173"],  # Frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data validation functions
def validate_product_name(product_name: str) -> str:
    """Validate product name"""
    if not product_name.strip():
        raise ValueError("Product name cannot be empty or whitespace.")
    if product_name not in PREDEFINED_PRODUCTS:
        raise ValueError(f"Product '{product_name}' is not available. Please select from predefined products.")
    return product_name

def validate_customer_name(customer_name: str) -> str:
    """Validate customer name"""
    if not customer_name.strip():
        raise ValueError("Customer name cannot be empty or whitespace.")
    if not re.match(r"^[a-zA-Z ]+$", customer_name):
        raise ValueError("Customer name can only contain alphabetic characters and spaces.")
    return customer_name

def validate_currency(currency: str) -> str:
    """Validate currency"""
    supported_currencies = ["CAD", "USD", "EUR", "GBP"]
    if currency not in supported_currencies:
        raise ValueError(f"Currency '{currency}' is not supported. Supported currencies: {', '.join(supported_currencies)}")
    return currency

def validate_order_items(order_items: List[dict]) -> List[dict]:
    """Validate order items"""
    if len(order_items) > 100:
        raise ValueError("You cannot add more than 100 line items.")

    product_names = set()
    total_quantity = 0

    for item in order_items:
        product_name = item.get("product_name", "")
        quantity = item.get("quantity", 0)
        
        # Validate product name
        validate_product_name(product_name)
        
        # Check for duplicate product names
        if product_name in product_names:
            raise ValueError(f"Duplicate product name detected: '{product_name}'.")
        product_names.add(product_name)

        # Accumulate total quantity
        total_quantity += quantity

    # Check total order quantity
    if total_quantity > 1000000:
        raise ValueError("The total quantity for the order cannot exceed 1,000,000.")

    return order_items

# Mount static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize Jinja2 templates
templates = Jinja2Templates(directory="templates")

# Utility functions
def generate_order_confirmation(order: OrderTable) -> str:
    """
    Generate an HTML string for order confirmation with pricing details.

    Args:
        order (OrderTable): The order object containing customer and item details.

    Returns:
        str: HTML string for the order confirmation page.
    """
    # Get exchange rates for currency conversion
    exchange_rates = {
        "CAD": 1.0,
        "USD": 0.75,
        "EUR": 0.68,
        "GBP": 0.59
    }
    
    conversion_rate = exchange_rates.get(order.currency, 1.0)
    
    # Calculate pricing for each item and total
    order_items_html = ""
    total_order_amount = 0
    
    for item in order.order_items:
        # Get base price in CAD
        base_price = PREDEFINED_PRODUCTS.get(item.product_name, 0)
        # Convert to order currency
        unit_price = base_price * conversion_rate
        line_total = unit_price * item.quantity
        total_order_amount += line_total
        
        order_items_html += f"""
        <tr>
            <td>{item.product_name}</td>
            <td>{item.quantity}</td>
            <td>{unit_price:.2f} {order.currency}</td>
            <td>{line_total:.2f} {order.currency}</td>
        </tr>
        """
    
    return f"""
    <div class='order-confirmation-container'>
        <h1>Order Confirmation</h1>
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Customer Name:</strong> {order.customer_name}</p>
        <p><strong>Currency:</strong> {order.currency}</p>
        <p><strong>Order Date:</strong> {order.created_at.strftime('%Y-%m-%d %H:%M:%S')}</p>
        
        <h3>Order Items:</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
                <tr style="background-color: #f5f5f5;">
                    <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Product</th>
                    <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Quantity</th>
                    <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Unit Price</th>
                    <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Line Total</th>
                </tr>
            </thead>
            <tbody>
                {order_items_html}
            </tbody>
            <tfoot>
                <tr style="background-color: #f9f9f9; font-weight: bold;">
                    <td colspan="3" style="border: 1px solid #ddd; padding: 12px; text-align: right;">Total Order Amount:</td>
                    <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">{total_order_amount:.2f} {order.currency}</td>
                </tr>
            </tfoot>
        </table>
        
        <button onclick=\"window.location.href='/'\">Create Another Order</button>
    </div>
    """

def generate_error_response(detail: str) -> HTMLResponse:
    """
    Generate an HTML response for errors.

    Args:
        detail (str): The error message to display.

    Returns:
        HTMLResponse: HTML response containing the error message.
    """
    return HTMLResponse(
        content=f"""
        <div class='order-confirmation-container'>
            <h1>Error</h1>
            <p>{detail}</p>
            <button onclick=\"window.location.href='/'\">Create Another Order</button>
        </div>
        """,
        status_code=400
    )

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
async def create_order(order_data: OrderCreate, request: Request, session: Session = Depends(get_session)):
    """
    Endpoint to create a new order.
    Validates the input data and stores the order in the database.
    Returns an HTML response for order confirmation or error.

    Args:
        order_data (OrderCreate): The order data submitted by the user.
        request (Request): The incoming HTTP request.
        session (Session): Database session.

    Returns:
        HTMLResponse: The HTML response for order confirmation or error.
    """
    try:
        # Validate input data
        validate_customer_name(order_data.customer_name)
        validate_currency(order_data.currency)
        
        # Convert order items to dict format for validation
        order_items_dict = [{"product_name": item.product_name, "quantity": item.quantity} for item in order_data.order_items]
        validate_order_items(order_items_dict)

        # Validate that the order has at least one order item
        if not order_data.order_items:
            raise HTTPException(status_code=400, detail="Order must have at least one order item.")

        # Create order in database
        db_order = OrderTable(
            customer_name=order_data.customer_name,
            currency=order_data.currency
        )
        session.add(db_order)
        session.flush()  # Flush to get the order ID

        # Create order items
        for item_data in order_data.order_items:
            db_order_item = OrderItemTable(
                product_name=item_data.product_name,
                quantity=item_data.quantity,
                order_id=db_order.id
            )
            session.add(db_order_item)

        session.commit()
        session.refresh(db_order)

        # Use utility function to generate confirmation HTML
        return HTMLResponse(content=generate_order_confirmation(db_order))

    except HTTPException as http_exc:
        session.rollback()
        # Use utility function to generate error HTML
        return generate_error_response(http_exc.detail)

    except Exception as exc:
        session.rollback()
        # Use utility function to generate error HTML
        return generate_error_response(f"An unexpected error occurred: {str(exc)}")

@app.get("/orders", response_model=List[OrderRead])
async def get_orders(session: Session = Depends(get_session)):
    """
    Endpoint to retrieve all orders from the database.
    
    Args:
        session (Session): Database session.
    
    Returns:
        List[OrderRead]: List of all orders with their items.
    """
    statement = select(OrderTable)
    orders = session.exec(statement).all()
    return orders

@app.get("/orders/{order_id}", response_model=OrderRead)
async def get_order(order_id: int, session: Session = Depends(get_session)):
    """
    Endpoint to retrieve a specific order from the database.
    
    Args:
        order_id (int): The ID of the order to retrieve.
        session (Session): Database session.
    
    Returns:
        OrderRead: The requested order with its items.
    """
    order = session.get(OrderTable, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

# Endpoint to fetch exchange rates
@app.get("/api/exchange-rates")
async def get_exchange_rates():
    """
    Return hardcoded exchange rates with CAD as the base currency.

    Returns:
        JSONResponse: A dictionary of hardcoded exchange rates.
    """
    hardcoded_rates = {
        "CAD": 1.0,
        "USD": 0.75,
        "EUR": 0.68,
        "GBP": 0.59
    }
    return JSONResponse(content=hardcoded_rates)

# Endpoint to fetch predefined products
@app.get("/api/products")
async def get_products():
    """
    Return predefined products with their prices in CAD.

    Returns:
        JSONResponse: A dictionary of predefined products and their prices.
    """
    return JSONResponse(content=PREDEFINED_PRODUCTS)