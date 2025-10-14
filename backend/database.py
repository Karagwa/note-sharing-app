from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = "sqlite:///./notes.db"

# Create the database engine
# echo=True logs all SQL queries (useful for debugging)
engine = create_engine(DATABASE_URL, echo=True, connect_args={"check_same_thread": False})

def get_session():
    """Dependency function that provides a database session to routes"""
    with Session(engine) as session:
        yield session

def create_db_and_tables():
    """Creates all tables defined in SQLModel models"""
    SQLModel.metadata.create_all(engine)