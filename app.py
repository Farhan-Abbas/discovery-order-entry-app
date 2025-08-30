from fastapi import FastAPI, HTTPException, Depends, Query, BackgroundTasks
from pydantic import BaseModel, Field, validator
from typing import List, Optional
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
import re
import os
import tempfile
from datetime import datetime

# PDF and Email imports
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.utils import ImageReader
import emails
from emails.template import JinjaTemplate

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

def generate_order_pdf(order: OrderTable) -> str:
    """
    Generate a PDF file for the order confirmation.
    
    Args:
        order (OrderTable): The order object containing customer and item details.
        
    Returns:
        str: Path to the generated PDF file.
    """
    # Create a temporary file for the PDF
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
    pdf_path = temp_file.name
    temp_file.close()
    
    # Create PDF document
    doc = SimpleDocTemplate(pdf_path, pagesize=letter, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=18)
    
    # Get styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=20,
        textColor=colors.HexColor('#1890ff'),
        spaceAfter=30,
        alignment=1  # Center alignment
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#1890ff'),
        spaceAfter=12
    )
    
    # Get exchange rates for currency conversion
    exchange_rates = {
        "CAD": 1.0,
        "USD": 0.75,
        "EUR": 0.68,
        "GBP": 0.59
    }
    
    conversion_rate = exchange_rates.get(order.currency, 1.0)
    
    # Build the PDF content
    content = []
    
    # Title
    content.append(Paragraph("ORDER CONFIRMATION", title_style))
    content.append(Spacer(1, 12))
    
    # Order Information
    content.append(Paragraph("Order Information", heading_style))
    order_info = [
        ['Order ID:', str(order.id)],
        ['Customer Name:', order.customer_name],
        ['Currency:', order.currency],
        ['Order Date:', order.created_at.strftime('%Y-%m-%d %H:%M:%S')],
    ]
    
    order_info_table = Table(order_info, colWidths=[2*inch, 3*inch])
    order_info_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f0f2ff')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d9d9d9')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    
    content.append(order_info_table)
    content.append(Spacer(1, 20))
    
    # Order Items
    content.append(Paragraph("Order Items", heading_style))
    
    # Prepare items data
    items_data = [['Product', 'Quantity', f'Unit Price ({order.currency})', f'Line Total ({order.currency})']]
    total_order_amount = 0
    
    for item in order.order_items:
        base_price = PREDEFINED_PRODUCTS.get(item.product_name, 0)
        unit_price = base_price * conversion_rate
        line_total = unit_price * item.quantity
        total_order_amount += line_total
        
        items_data.append([
            item.product_name,
            str(item.quantity),
            f'{unit_price:.2f}',
            f'{line_total:.2f}'
        ])
    
    # Add total row
    items_data.append(['', '', 'TOTAL:', f'{total_order_amount:.2f}'])
    
    # Create items table
    items_table = Table(items_data, colWidths=[2.5*inch, 1*inch, 1.5*inch, 1.5*inch])
    items_table.setStyle(TableStyle([
        # Header row
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1890ff')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        
        # Data rows
        ('BACKGROUND', (0, 1), (-1, -2), colors.white),
        ('TEXTCOLOR', (0, 1), (-1, -2), colors.black),
        ('ALIGN', (0, 1), (0, -2), 'LEFT'),  # Product names left-aligned
        ('ALIGN', (1, 1), (-1, -2), 'CENTER'),  # Numbers center-aligned
        ('FONTNAME', (0, 1), (-1, -2), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -2), 10),
        
        # Total row
        ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#f0f2ff')),
        ('TEXTCOLOR', (0, -1), (-1, -1), colors.black),
        ('ALIGN', (0, -1), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, -1), (-1, -1), 11),
        
        # Grid
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d9d9d9')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    
    content.append(items_table)
    content.append(Spacer(1, 20))
    
    # Footer
    footer_text = f"<para align=center><font size=8 color='#666666'>Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}<br/>Order Entry System</font></para>"
    content.append(Paragraph(footer_text, styles['Normal']))
    
    # Build PDF
    doc.build(content)
    
    return pdf_path

def send_order_email(order: OrderTable, pdf_path: str, recipient_email: str) -> bool:
    """
    Simulate sending order confirmation email with PDF attachment.
    This is a simulation - no actual email is sent.
    
    Args:
        order (OrderTable): The order object.
        pdf_path (str): Path to the PDF file.
        recipient_email (str): Email address to send to.
        
    Returns:
        bool: Always returns True (simulation mode).
    """
    try:
        # Simulate email processing delay
        import time
        time.sleep(1)  # Simulate email sending time
        
        # Log the simulated email details
        print(f"[EMAIL SIMULATION] Order confirmation email would be sent:")
        print(f"  To: {recipient_email}")
        print(f"  Subject: Order Confirmation #{order.id} - {order.customer_name}")
        print(f"  Order ID: {order.id}")
        print(f"  Customer: {order.customer_name}")
        print(f"  Date: {order.created_at.strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"  Currency: {order.currency}")
        print(f"  PDF Attachment: order_confirmation_{order.id}.pdf")
        print(f"  Email Body: HTML formatted order confirmation")
        print(f"[EMAIL SIMULATION] Email successfully 'sent' (simulation mode)")
        
        # In a real implementation, you would:
        # 1. Configure SMTP settings (Gmail, SendGrid, etc.)
        # 2. Create the email with HTML template
        # 3. Attach the PDF file
        # 4. Send via SMTP
        # 5. Handle any email service errors
        
        return True  # Always succeed in simulation mode
        
    except Exception as e:
        print(f"[EMAIL SIMULATION] Error in simulation: {str(e)}")
        return False

def cleanup_pdf_file(file_path: str):
    """
    Background task to clean up temporary PDF files.
    
    Args:
        file_path (str): Path to the PDF file to delete.
    """
    try:
        if os.path.exists(file_path):
            os.unlink(file_path)
            print(f"Cleaned up temporary file: {file_path}")
    except Exception as e:
        print(f"Error cleaning up file {file_path}: {str(e)}")

# Routes
@app.get("/")
async def root():
    """
    Root endpoint to provide API information.

    Returns:
        dict: API information and status.
    """
    return {
        "message": "Order Entry API", 
        "status": "running",
        "frontend": "React app running on http://localhost:5173",
        "docs": "/docs"
    }

@app.post("/order", response_class=HTMLResponse)
async def create_order(order_data: OrderCreate, session: Session = Depends(get_session)):
    """
    Endpoint to create a new order.
    Validates the input data and stores the order in the database.
    Returns an HTML response for order confirmation or error.

    Args:
        order_data (OrderCreate): The order data submitted by the user.
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

# PDF and Email endpoints
@app.get("/orders/{order_id}/pdf")
async def download_order_pdf(
    order_id: int, 
    background_tasks: BackgroundTasks,
    session: Session = Depends(get_session)
):
    """
    Generate and download PDF for a specific order.
    
    Args:
        order_id (int): The ID of the order.
        background_tasks (BackgroundTasks): Background tasks for cleanup.
        session (Session): Database session.
        
    Returns:
        FileResponse: PDF file download.
    """
    # Get order from database
    order = session.get(OrderTable, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    try:
        # Generate PDF
        pdf_path = generate_order_pdf(order)
        
        # Schedule cleanup of the temporary file after response is sent
        background_tasks.add_task(cleanup_pdf_file, pdf_path)
        
        # Return file response
        return FileResponse(
            path=pdf_path,
            filename=f"order_confirmation_{order_id}.pdf",
            media_type="application/pdf"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")

@app.post("/orders/{order_id}/email")
async def email_order_confirmation(
    order_id: int, 
    email: str = Query(..., description="Email address to send the confirmation to"),
    session: Session = Depends(get_session)
):
    """
    Email order confirmation with PDF attachment.
    
    Args:
        order_id (int): The ID of the order.
        email (str): Email address to send to.
        session (Session): Database session.
        
    Returns:
        JSONResponse: Success or error message.
    """
    # Validate email format
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, email):
        raise HTTPException(status_code=400, detail="Invalid email address format")
    
    # Get order from database
    order = session.get(OrderTable, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    try:
        # Generate PDF
        pdf_path = generate_order_pdf(order)
        
        # Send email
        email_sent = send_order_email(order, pdf_path, email)
        
        # Clean up PDF file
        if os.path.exists(pdf_path):
            os.unlink(pdf_path)
        
        if email_sent:
            return JSONResponse(
                content={
                    "message": f"📧 Email simulation successful! In a real implementation, order confirmation would be sent to {email}",
                    "simulation": True,
                    "order_id": order_id,
                    "email": email,
                    "note": "This is a demonstration mode. No actual email was sent."
                }
            )
        else:
            raise HTTPException(
                status_code=500, 
                detail="Failed to send email. Please check email configuration."
            )
            
    except HTTPException:
        raise
    except Exception as e:
        # Clean up PDF file in case of error
        if 'pdf_path' in locals() and os.path.exists(pdf_path):
            os.unlink(pdf_path)
        raise HTTPException(status_code=500, detail=f"Failed to process request: {str(e)}")