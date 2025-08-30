# Full-Stack Order Entry Application

## Overview
This is a modern full-stack web application for creating and managing customer sales orders. The backend is built with FastAPI and PostgreSQL, and the frontend is a React application with TypeScript support, enterprise-grade UI components, and a professional dark/light theme system. The application supports dynamic form submission, predefined products with pricing, currency conversion, PDF generation, email functionality, and provides a rich user interface with real-time validation.

## Quick Start

### Docker Deployment (Recommended)

The easiest way to run the application is using Docker:

**Prerequisites:**
- Docker (version 20.10+)
- Docker Compose (version 2.0+)

**Setup:**
```bash
# Clone and navigate to the project
git clone <repository-url>
cd discovery-order-entry-app

# Start all services
docker-compose up --build
```

**Access Points:**
- Frontend: http://localhost
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

**Services:**
- 🐘 **Database:** PostgreSQL 15 with persistent data
- 🚀 **Backend:** FastAPI with PDF generation and email simulation
- ⚛️ **Frontend:** React + Ant Design served by Nginx

**Management Commands:**
```bash
# Start services in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Reset database
docker-compose down -v && docker-compose up --build
```

### Local Development Setup

For development without Docker:

📋 **For detailed Docker instructions, see [DOCKER.md](DOCKER.md)**

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
- **PDF Generation**: Professional order confirmations with ReportLab
- **Email System**: Integrated email simulation for order notifications
- **Docker Support**: Full containerization with Docker Compose

## Requirements and Dependencies

### System Requirements
- **Docker Deployment**: Docker 20.10+ and Docker Compose 2.0+
- **Local Development**: Python 3.11+, Node.js 18+, PostgreSQL 12+

### Key Technologies
- **Backend**: FastAPI 0.116.1, SQLModel, PostgreSQL
- **Frontend**: React 18.2.0, Ant Design 5.27.1, Vite 4.4.5
- **Deployment**: Docker, Nginx, multi-container architecture

All dependencies are automatically handled in Docker deployment. For local development, see `requirements.txt` and `frontend/package.json`.

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

**Backend Setup:**
```bash
# Install Python dependencies
pip install -r requirements.txt

# Set up PostgreSQL database
createdb order_entry_db
export DATABASE_URL=postgresql://order_user:order_password@localhost:5432/order_entry_db

# Start backend
uvicorn app:app --reload
```

**Frontend Setup:**
```bash
# Install Node.js dependencies
cd frontend
npm install

# Start development server
npm run dev
```

The application will be available at http://localhost:5173

## Features

**Core Functionality:**
- Order entry with customer information and product selection
- Real-time validation and currency conversion
- PDF generation and email simulation
- Professional light/dark theme system

**Technical Features:**
- Enterprise-grade UI with Ant Design components
- Responsive design for all device sizes
- RESTful API with automatic documentation
- PostgreSQL database with data persistence

## API Endpoints
- `GET /docs` - Interactive API documentation (Swagger UI)
- `POST /order` - Create new order
- `GET /orders` - Retrieve all orders
- `GET /api/products` - Product catalog
- `GET /api/exchange-rates` - Currency exchange rates

## Testing

**Backend Tests:**
```bash
pytest
pytest --cov=app  # with coverage
```

**Frontend Tests:**
```bash
cd frontend
npm test
npm run test:coverage  # with coverage
```

## Development

**Backend Development:**
```bash
uvicorn app:app --reload
```

**Frontend Development:**
```bash
cd frontend
npm run dev
```

## Troubleshooting

### Docker Issues
```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f [service-name]

# Reset everything
docker-compose down -v --remove-orphans
docker system prune
docker-compose up --build

# Database connection test
docker-compose exec database psql -U order_user -d order_entry_db
```

### Common Issues
- **Port conflicts**: Ensure ports 80, 8000, and 5432 are available
- **API connection**: Check that backend is running and accessible
- **Database connection**: Verify PostgreSQL is running and credentials are correct

## Architecture

### Tech Stack
- **Frontend**: React 18 + Ant Design + Vite
- **Backend**: FastAPI + SQLModel + PostgreSQL  
- **Deployment**: Docker + Nginx + Multi-container setup
- **Features**: PDF generation, email simulation, theme system

### Design Decisions
- **React over Vanilla JS**: Better component reusability and state management
- **Ant Design**: Enterprise-grade UI components and consistent design
- **FastAPI**: High performance with automatic API documentation
- **Docker**: Consistent deployment across environments

## Roadmap
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