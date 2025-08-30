-- Initialize database schema for Order Entry Application

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR NOT NULL,
    currency VARCHAR NOT NULL DEFAULT 'CAD',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR NOT NULL,
    quantity INTEGER NOT NULL,
    order_id INTEGER NOT NULL REFERENCES orders(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS ix_orders_customer_name ON orders (customer_name);
CREATE INDEX IF NOT EXISTS ix_order_items_product_name ON order_items (product_name);

-- Insert sample data (optional)
INSERT INTO orders (customer_name, currency, created_at) 
VALUES 
    ('John Doe', 'CAD', CURRENT_TIMESTAMP),
    ('Jane Smith', 'USD', CURRENT_TIMESTAMP),
    ('Bob Johnson', 'EUR', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert sample order items
INSERT INTO order_items (product_name, quantity, order_id)
VALUES 
    ('Premium Widget', 2, 1),
    ('Standard Widget', 5, 2),
    ('Deluxe Widget', 1, 3)
ON CONFLICT DO NOTHING;
