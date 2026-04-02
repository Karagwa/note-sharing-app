import os
from sqlmodel import create_engine, Session, SQLModel

DATABASE_URL = os.getenv("DATABASE_URL")
print("🔥 NEW DEPLOYMENT ACTIVE 🔥")

engine = create_engine(
    DATABASE_URL,
    echo=True
)

def get_session():
    """Dependency function that provides a database session to routes"""
    with Session(engine) as session:
        yield session

def create_db_and_tables():
    """Creates all tables defined in SQLModel models"""
    SQLModel.metadata.create_all(engine)