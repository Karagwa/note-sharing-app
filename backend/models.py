from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

class User(SQLModel, table=True):
    """User model for authentication"""
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True, max_length=50)
    email: str = Field(unique=True, index=True, max_length=100)
    hashed_password: str
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # For password reset
    reset_token: Optional[str] = Field(default=None, unique=True)
    reset_token_expires: Optional[datetime] = None
    
    # Relationships
    notes: List["Note"] = Relationship(back_populates="owner")


class Note(SQLModel, table=True):
    """Database model - represents the actual table structure"""
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(max_length=200)
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    
    # Owner relationship
    owner_id: int = Field(foreign_key="user.id")
    owner: Optional[User] = Relationship(back_populates="notes")
    
    # Sharing settings
    is_public: bool = Field(default=False)
    share_token: Optional[str] = Field(default=None, unique=True, index=True)