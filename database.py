from sqlmodel import SQLModel, create_engine, Session
from typing import Generator
import os

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://order_user:order_password@localhost:5432/order_entry_db")

# Create engine
engine = create_engine(DATABASE_URL, echo=False)  # Set echo=True for SQL debugging

def create_db_and_tables():
    """Create database tables"""
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator[Session, None, None]:
    """Dependency to get database session"""
    with Session(engine) as session:
        yield session
