# Full-Stack Order Entry Application

## Overview
This is a modern full-stack web application for creating and managing customer sales orders. The backend is built with FastAPI and PostgreSQL, and the frontend is a React application with TypeScript support, enterprise-grade UI components, and a professional dark/light theme system. The application supports dynamic form submission, predefined products with pricing, currency conversion, and provides a rich user interface with real-time validation.

## Features
- **Backend**: FastAPI with PostgreSQL database
- **Frontend**: React 18 with Vite for fast development
- **UI Framework**: Ant Design for enterprise-grade components
- **Theme System**: Professional light/dark mode with smooth transitions
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Real-time Features**: Currency conversion and input validation
- **Data Validation**: Comprehensive client-side and server-side validation
- **Modern Architecture**: Component-based React with custom hooks
- **Type Safety**: PropTypes and structured data validation

## Requirements
- Python 3.13.3+
- Node.js 18+ and npm
- PostgreSQL 12+

## Dependencies

### Backend Dependencies
The following Python packages are required:
- `fastapi==0.116.1`
- `uvicorn[standard]==0.35.0`
- `pydantic==2.9.2`
- `httpx==0.28.1`
- `sqlmodel==0.0.8`
- `psycopg2-binary==2.9.7`
- `alembic==1.12.0`

These are listed in the `requirements.txt` file.

### Frontend Dependencies
The React frontend uses:
- `react==18.2.0`
- `react-dom==18.2.0`
- `antd==5.27.1` (Enterprise UI components)
- `vite==4.4.5` (Build tool and dev server)
- `@vitejs/plugin-react==4.0.3`

These are listed in the `frontend/package.json` file.

## Project Structure
```
discovery-order-entry-app/
├── frontend/                     # React frontend application
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── CustomerForm.jsx
│   │   │   ├── OrderItem.jsx
│   │   │   ├── OrderItems.jsx
│   │   │   ├── CurrencySelector.jsx
│   │   │   ├── PricingSummary.jsx
│   │   │   ├── OrderConfirmation.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── contexts/            # React contexts
│   │   │   └── ThemeContext.jsx # Theme management
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useApiData.js    # API data fetching
│   │   │   └── useOrderManagement.js # Order state management
│   │   ├── App.jsx              # Main application component
│   │   ├── AppWrapper.jsx       # Theme provider wrapper
│   │   └── main.jsx             # React entry point
│   ├── public/                  # Static assets
│   ├── package.json             # Frontend dependencies
│   ├── vite.config.js           # Vite configuration
│   └── index.html               # HTML entry point
├── app.py                       # FastAPI backend application
├── database.py                  # Database configuration
├── models.py                    # SQLModel database models
├── requirements.txt             # Python dependencies
├── setup_database.sh            # Database setup script
├── .env.example                 # Environment variables template
├── tests/                       # Unit tests
│   └── test_app.py              # Backend test cases
└── README.md                    # Project documentation
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

### 6. Install Backend Dependencies
```bash
$ pip install -r requirements.txt
```

### 7. Install Frontend Dependencies
```bash
$ cd frontend
$ npm install
```

### 8. Run the Application

#### Start the Backend Server
In the project root directory:
```bash
$ uvicorn app:app --reload
```
The backend API will be available at: `http://127.0.0.1:8000`

#### Start the Frontend Development Server
In a new terminal, navigate to the frontend directory:
```bash
$ cd frontend
$ npm run dev
```
The React frontend will be available at: `http://localhost:5173`

### 9. Access the Application
Open your browser and navigate to:
```
http://localhost:5173
```

The frontend will automatically connect to the backend API running on port 8000.

## Usage
1. **Theme Selection**: Toggle between light and dark modes using the theme switcher in the header
2. **Customer Information**: Fill in the customer name with real-time validation
3. **Product Selection**: Choose from predefined products using the dropdown selectors
4. **Quantity Input**: Enter quantities with automatic validation (numbers only, 1-1,000,000 range)
5. **Multiple Items**: Add multiple order items using the "Add Item" button
6. **Currency Conversion**: Select different currencies to see real-time price updates
7. **Order Review**: View the pricing summary with total calculations
8. **Order Submission**: Submit the form to see a detailed confirmation page
9. **Responsive Design**: The application works seamlessly on desktop, tablet, and mobile devices

## User Interface Features
- **Professional Theme System**: Clean light mode and elegant dark mode
- **Enterprise Components**: Ant Design components for consistent, professional appearance
- **Real-time Validation**: Immediate feedback on form inputs
- **Responsive Grid**: Adaptive layout that works on all screen sizes
- **Smooth Animations**: Professional transitions and hover effects
- **Accessibility**: Proper contrast ratios and keyboard navigation support

## API Endpoints
- `GET /` - API information and status
- `POST /order` - Create a new order (returns HTML confirmation)
- `GET /orders` - Retrieve all orders (JSON)
- `GET /orders/{order_id}` - Retrieve a specific order (JSON)
- `GET /api/products` - Get predefined products with prices (JSON)
- `GET /api/exchange-rates` - Get current exchange rates (JSON)
- `GET /docs` - Interactive API documentation (Swagger UI)

## Software Tech Stack and Architecture Decisions

### Backend Architecture
- **FastAPI**: Chosen for speed, automatic API documentation, and built-in validation with Pydantic
- **PostgreSQL**: Robust relational database with ACID compliance and excellent performance
- **SQLModel**: Type-safe ORM that integrates seamlessly with FastAPI and Pydantic
- **CORS Middleware**: Configured for secure cross-origin requests from the React frontend

### Frontend Architecture
- **React 18**: Modern React with hooks for component state management
- **Vite**: Lightning-fast build tool and development server with hot module replacement
- **Ant Design**: Enterprise-grade UI component library used in production systems
- **Component Architecture**: Modular, reusable components with clear separation of concerns
- **Custom Hooks**: Business logic separation with `useApiData` and `useOrderManagement`
- **Context API**: Global theme state management without external dependencies

### Design System
- **Theme Context**: Centralized theme management with localStorage persistence
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Professional Styling**: Consistent color palettes, typography, and spacing
- **Accessibility**: Proper contrast ratios, ARIA labels, and keyboard navigation

### Data Flow
1. **Frontend → Backend**: React hooks fetch data from FastAPI endpoints
2. **State Management**: Local React state with custom hooks for business logic
3. **Form Handling**: Controlled components with real-time validation
4. **API Communication**: RESTful API calls with proper error handling

## Design Decisions and Tradeoffs

### Frontend Framework Choice
- **React vs Vanilla JS**: Migrated to React for better component reusability, state management, and maintainability
- **Ant Design vs Custom CSS**: Chose Ant Design for enterprise-grade components, consistent design language, and reduced development time
- **Vite vs Create React App**: Selected Vite for faster development builds and better performance

### Architecture Patterns
- **Component Composition**: Modular components for better reusability and testing
- **Custom Hooks**: Separation of business logic from UI components
- **Context Pattern**: Global theme state without prop drilling
- **Controlled Components**: Form inputs managed by React state for better validation

### User Experience
- **Theme System**: Professional light/dark modes for different user preferences and lighting conditions
- **Responsive Design**: Mobile-first approach ensuring usability across all devices
- **Real-time Validation**: Immediate feedback reduces user errors and improves form completion rates
- **Loading States**: Clear visual feedback during API calls and data processing

### Performance Considerations
- **Code Splitting**: React lazy loading for optimized bundle sizes
- **Development Speed**: Vite HMR for instant feedback during development
- **Production Builds**: Optimized bundles with tree shaking and minification

### Scalability Decisions
- **Modular Architecture**: Easy to add new features and components
- **API-First Design**: Backend can serve multiple frontends (web, mobile, etc.)
- **Database Normalization**: Proper relational structure for data integrity

## Testing

### Backend Testing
Unit tests are included to ensure the functionality and reliability of the backend. The tests cover:
- Validation of customer name and order items
- Successful order creation and database storage
- Error handling for invalid inputs (e.g., missing customer name, duplicate product names)
- Database operations and data integrity
- API endpoint responses and status codes

### Frontend Testing
The React application includes:
- Component rendering tests
- User interaction testing
- Form validation testing
- API integration testing
- Theme switching functionality

### Running the Tests

#### Backend Tests
1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up Test Database** (optional):
   ```bash
   export DATABASE_URL=postgresql://order_user:order_password@localhost:5432/order_entry_test_db
   ```

3. **Run Backend Tests**:
   ```bash
   pytest
   ```

#### Frontend Tests
1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Run Frontend Tests**:
   ```bash
   npm test
   ```

3. **Run Tests with Coverage**:
   ```bash
   npm run test:coverage
   ```

## Development Workflow

### Frontend Development
```bash
# Start frontend development server
cd frontend
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend Development
```bash
# Start backend with auto-reload
uvicorn app:app --reload

# Run with different host/port
uvicorn app:app --host 0.0.0.0 --port 8000

# Run tests
pytest

# Run with coverage
pytest --cov=app
```

## Production Deployment

### Frontend Production Build
```bash
cd frontend
npm run build
# Serve the dist/ folder with a web server like Nginx
```

### Backend Production
```bash
# Install production dependencies
pip install -r requirements.txt

# Run with Gunicorn for production
pip install gunicorn
gunicorn app:app -w 4 -k uvicorn.workers.UvicornWorker
```

## Next Steps for Production
- **Authentication**: Implement JWT-based authentication and user management
- **Database Migrations**: Set up Alembic for proper database version control
- **Logging & Monitoring**: Add structured logging, health checks, and monitoring
- **Security**: Implement rate limiting, security headers, and input sanitization
- **Performance**: Add caching layers (Redis) and database connection pooling
- **Testing**: Expand test coverage with E2E tests using Playwright or Cypress
- **CI/CD**: Set up automated testing and deployment pipelines
- **Documentation**: Add Storybook for component documentation
- **Live APIs**: Replace hardcoded exchange rates with live financial APIs
- **Internationalization**: Add multi-language support
- **PWA Features**: Add offline support and installability
- **Analytics**: Implement user analytics and error tracking