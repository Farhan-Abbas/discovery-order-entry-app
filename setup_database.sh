#!/bin/bash

# PostgreSQL setup script for the order entry application

echo "Setting up PostgreSQL database for Order Entry Application..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL is not installed. Please install PostgreSQL first."
    echo "On Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
    echo "On macOS: brew install postgresql"
    exit 1
fi

# Check if PostgreSQL service is running
if ! systemctl is-active --quiet postgresql && ! brew services list | grep postgresql | grep started &> /dev/null; then
    echo "Starting PostgreSQL service..."
    # Try systemctl first (Linux)
    sudo systemctl start postgresql 2>/dev/null || {
        # Try brew services (macOS)
        brew services start postgresql 2>/dev/null || {
            echo "Could not start PostgreSQL service. Please start it manually."
            exit 1
        }
    }
fi

# Database configuration
DB_NAME="order_entry_db"
DB_USER="order_user"
DB_PASSWORD="order_password"

echo "Creating database and user..."

# Create database and user
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || echo "Database $DB_NAME may already exist"
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null || echo "User $DB_USER may already exist"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
sudo -u postgres psql -c "ALTER USER $DB_USER CREATEDB;"

echo "Database setup complete!"
echo ""
echo "Database connection details:"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo "  Password: $DB_PASSWORD"
echo "  Host: localhost"
echo "  Port: 5432"
echo ""
echo "Connection URL: postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"
echo ""
echo "Please update your environment variable:"
echo "export DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"
