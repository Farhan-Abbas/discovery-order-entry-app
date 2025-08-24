import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import pytest
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

# Test data
valid_order = {
    "customer_name": "John Doe",
    "order_items": [
        {"product_name": "Product A", "quantity": 10},
        {"product_name": "Product B", "quantity": 5}
    ]
}

invalid_order_missing_name = {
    "order_items": [
        {"product_name": "Product A", "quantity": 10}
    ]
}

invalid_order_duplicate_items = {
    "customer_name": "John Doe",
    "order_items": [
        {"product_name": "Product A", "quantity": 10},
        {"product_name": "Product A", "quantity": 5}
    ]
}

# Test cases
def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "Order Entry Form" in response.text

def test_create_order_success():
    response = client.post("/order", json=valid_order)
    assert response.status_code == 200
    assert "Order Confirmation" in response.text

def test_create_order_missing_name():
    response = client.post("/order", json=invalid_order_missing_name)
    assert response.status_code == 422
    assert "Field required" in response.text

def test_create_order_duplicate_items():
    response = client.post("/order", json=invalid_order_duplicate_items)
    assert response.status_code == 422
    assert "Duplicate product name detected" in response.text
