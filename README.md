# Full-Stack Order Entry Application

## Overview
This is a full-stack web application for creating and managing customer sales orders. The backend is built with FastAPI and PostgreSQL, and the frontend uses HTML, CSS, and JavaScript. The application supports dynamic form submission, predefined products with pricing, currency conversion, and provides informative responses for both successful and erroneous submissions.

## Features
- Backend API with FastAPI and PostgreSQL database
- Dynamic frontend with JavaScript
- Predefined products with pricing in multiple currencies
- Real-time currency conversion
- Data validation for customer name and order items
- Informative HTML responses for errors and confirmations
- Persistent storage with PostgreSQL

## Requirements
- Python 3.13.3
- PostgreSQL 12+

## Dependencies
The following Python packages are required:
- `fastapi==0.116.1`
- `uvicorn[standard]==0.35.0`
- `jinja2==3.1.4`
- `pydantic==2.9.2`
- `httpx==0.28.1`
- `sqlmodel==0.0.8`
- `psycopg2-binary==2.9.7`
- `alembic==1.12.0`

These are listed in the `requirements.txt` file.

## Project Structure
```
project/
├── app.py                # Backend application
├── database.py           # Database configuration
├── models.py             # SQLModel database models
├── requirements.txt      # Python dependencies
├── setup_database.sh     # Database setup script
├── .env.example          # Environment variables template
├── templates/            # HTML templates
│   └── index.html        # Order entry form
├── static/               # Static files
│   ├── css/             # CSS styles
│   │   └── styles.css   # Styling for the form
│   └── js/              # JavaScript files
│       └── main.js      # Frontend logic
├── tests/                # Unit tests
│   └── test_app.py       # Test cases for the application
└── README.md             # Project documentation
```

## Setup Instructions

### 1. Clone the Repository
```bash
$ git clone https://github.com/Farhan-Abbas/discovery-order-entry-app.git
$ cd discovery-order-entry-app
```

### 2. Install PostgreSQL
#### For Ubuntu/Debian:
```bash
$ sudo apt-get update
$ sudo apt-get install postgresql postgresql-contrib
```
#### For macOS:
```bash
$ brew install postgresql
$ brew services start postgresql
```

### 3. Set up the Database
Run the provided setup script:
```bash
$ ./setup_database.sh
```

Or manually create the database:
```bash
$ sudo -u postgres createdb order_entry_db
$ sudo -u postgres createuser order_user
$ sudo -u postgres psql -c "ALTER USER order_user WITH PASSWORD 'order_password';"
$ sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE order_entry_db TO order_user;"
```

### 4. Configure Environment Variables
Copy the environment template and update as needed:
```bash
$ cp .env.example .env
$ export DATABASE_URL=postgresql://order_user:order_password@localhost:5432/order_entry_db
```

### 5. Create a Virtual Environment
#### For Unix/Linux/macOS:
```bash
$ python3.13 -m venv .venv
$ source .venv/bin/activate
```
#### For Windows:
```cmd
> python -m venv .venv
> .venv\Scripts\activate
```

### 6. Install Dependencies
```bash
$ pip install -r requirements.txt
```

### 7. Run the Application
```bash
$ uvicorn app:app --reload
```

### 8. Access the Application
Open your browser and navigate to:
```
http://127.0.0.1:8000
```

## Usage
1. Fill in the customer name and select products from the predefined list.
2. Choose quantities and select the desired currency for pricing.
3. Add multiple order items using the "Add Order Item" button.
4. Submit the form. The backend will validate the data, save it to the PostgreSQL database, and return a detailed confirmation with pricing information.

## API Endpoints
- `GET /` - Serve the order entry form
- `POST /order` - Create a new order
- `GET /orders` - Retrieve all orders
- `GET /orders/{order_id}` - Retrieve a specific order
- `GET /api/products` - Get predefined products with prices
- `GET /api/exchange-rates` - Get current exchange rates

## Software Tech Stack and Architecture Decisions
- **Backend**: FastAPI provides speed, simplicity, and built-in validation with Pydantic.
- **Database**: PostgreSQL with SQLModel ORM for robust, persistent data storage.
- **Frontend**: HTML, CSS, and JavaScript provide a lightweight and dynamic user interface, with JavaScript enabling dynamic form submission via the Fetch API for a smooth user experience.
- **Database Storage**: PostgreSQL ensures data persistence, ACID compliance, and scalability for production use.
- **Validation**: Both client-side and server-side validation are implemented to ensure data integrity and provide immediate feedback to users.
- **Virtual Environment**: A virtual environment is used to isolate dependencies, ensuring compatibility and preventing conflicts with system-wide Python packages.

## Design Decisions and Tradeoffs
- **Predefined Products**: Using a predefined product catalog with fixed prices enables consistent pricing and currency conversion.
- **Database Migration**: Moved from in-memory storage to PostgreSQL for data persistence, better concurrent access, and production readiness.
- **SQLModel Integration**: Chosen for seamless integration with FastAPI and Pydantic, providing type safety and automatic API documentation.
- **Dynamic Form**: JavaScript dynamically adds order items, improving usability but requiring careful handling of field names and validation.
- **Currency Conversion**: Real-time currency conversion using hardcoded exchange rates (can be easily extended to use live APIs).
- **Feature Enhancements**: Added predefined products, pricing, currency conversion, and persistent storage while maintaining simplicity.

## Testing

Unit tests are included to ensure the functionality and reliability of the application. The tests cover:
- Validation of customer name and order items.
- Successful order creation and database storage.
- Error handling for invalid inputs (e.g., missing customer name, duplicate product names).
- Database operations and data integrity.

### Running the Tests

1. **Install Dependencies**:
   Ensure all dependencies, including `pytest`, are installed by running:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up Test Database** (optional):
   For integration tests, you may want to set up a separate test database:
   ```bash
   export DATABASE_URL=postgresql://order_user:order_password@localhost:5432/order_entry_test_db
   ```

3. **Run the Tests**:
   Navigate to the project directory and execute:
   ```bash
   pytest
   ```

4. **View the Results**:
   - If all tests pass, you'll see a summary indicating success.
   - If any tests fail, `pytest` will show detailed error messages.

## Next Steps for Production
- Implement database migrations with Alembic
- Add authentication and authorization
- Implement proper logging and monitoring
- Add rate limiting and security headers
- Use environment-specific configuration
- Implement comprehensive error handling
- Add data backup and recovery procedures
- Use live exchange rate APIs
- Add comprehensive API documentation with OpenAPI
- Implement caching for better performance