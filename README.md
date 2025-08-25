# Full-Stack Order Entry Application

## Overview
This is a full-stack web application for creating and managing customer sales orders. The backend is built with FastAPI, and the frontend uses HTML, CSS, and JavaScript. The application supports dynamic form submission and provides informative responses for both successful and erroneous submissions.

## Features
- Backend API with FastAPI
- Dynamic frontend with JavaScript
- Data validation for customer name and order items
- Informative HTML responses for errors and confirmations
- In-memory storage for orders

## Requirements
- Python 3.13.3

## Dependencies
The following Python packages are required:
- `fastapi==0.116.1`
- `uvicorn[standard]==0.35.0`
- `jinja2==3.1.4`
- `pydantic==2.9.2`
- `httpx==0.28.1`

These are listed in the `requirements.txt` file.

## Project Structure
```
project/
├── app.py                # Backend application
├── requirements.txt      # Python dependencies
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

### 2. Create a Virtual Environment
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

### 3. Install Dependencies
```bash
$ pip install -r requirements.txt
```

### 4. Run the Application
```bash
$ uvicorn app:app --reload
```

### 5. Access the Application
Open your browser and navigate to:
```
http://127.0.0.1:8000
```

## Usage
1. Fill in the customer name and add order items dynamically using the "Add Order Item" button.
2. Submit the form. The backend will validate the data and return a confirmation or error message.

## Software Tech Stack and Architecture Decisions
- **Backend**: FastAPI provides speed, simplicity, and built-in validation with Pydantic.
- **Frontend**: HTML, CSS, and JavaScript provide a lightweight and dynamic user interface, with JavaScript enabling dynamic form submission via the Fetch API for a smooth user experience.
- **In-Memory Storage**: Orders are stored in a Python dictionary for simplicity. While this avoids the complexity of setting up a database, it means data is lost when the server restarts. For a production system, a database would be necessary.
- **Validation**: Both client-side and server-side validation are implemented to ensure data integrity and provide immediate feedback to users.
- **Virtual Environment**: A virtual environment is used to isolate dependencies, ensuring compatibility and preventing conflicts with system-wide Python packages.

## Design Decisions and Tradeoffs
- **Dynamic Form**: JavaScript dynamically adds order items, improving usability but requiring careful handling of field names and validation.
- **Tradeoff of Simplicity**: The use of in-memory storage and HTML-based error handling prioritizes simplicity and user experience for this small-scale project but would need enhancements for scalability and security in production.
- **Feature Enhancements**: I added a remove order item feature for better UX, and considered adding order history viewing but kept it simple per the core requirements.

## Testing

Unit tests are included to ensure the functionality and reliability of the application. The tests cover:
- Validation of customer name and order items.
- Successful order creation.
- Error handling for invalid inputs (e.g., missing customer name, duplicate product names).

### Running the Tests

1. **Install Dependencies**:
   Ensure all dependencies, including `pytest`, are installed by running:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Tests**:
   Navigate to the project directory and execute:
   ```bash
   pytest
   ```

3. **View the Results**:
   - If all tests pass, you'll see a summary indicating success.
   - If any tests fail, `pytest` will show detailed error messages.

## Next Steps for Production
- Replace in-memory storage with a database
- Add CSRF protection
- Enforce HTTPS in production.
- Etc.