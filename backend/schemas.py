from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from pydantic import EmailStr, field_validator
import re


class UserBase(SQLModel):
    """Base user schema"""
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr


class UserCreate(UserBase):
    """Schema for user registration"""
    password: str = Field(min_length=8, max_length=100)
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one digit')
        return v
    
    @field_validator('username')
    @classmethod
    def validate_username(cls, v: str) -> str:
        if not re.match(r'^[a-zA-Z0-9_-]+$', v):
            raise ValueError('Username can only contain letters, numbers, hyphens, and underscores')
        return v


class UserLogin(SQLModel):
    """Schema for user login"""
    username: str
    password: str


class UserResponse(UserBase):
    """Schema for user response (no password)"""
    id: int
    is_active: bool
    is_verified: bool
    created_at: datetime


class Token(SQLModel):
    """Schema for JWT token response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(SQLModel):
    """Schema for token payload data"""
    username: Optional[str] = None
    user_id: Optional[int] = None


class PasswordReset(SQLModel):
    """Schema for password reset request"""
    email: EmailStr


class PasswordResetConfirm(SQLModel):
    """Schema for confirming password reset"""
    token: str
    new_password: str = Field(min_length=8, max_length=100)


class PasswordChange(SQLModel):
    """Schema for changing password (authenticated user)"""
    current_password: str
    new_password: str = Field(min_length=8, max_length=100)


# ============= Note Schemas =============

class NoteBase(SQLModel):
    """Base schema with common note fields"""
    title: str = Field(max_length=200)
    content: str


class NoteCreate(NoteBase):
    """Schema for creating a new note (POST request)"""
    is_public: bool = Field(default=False)


class NoteUpdate(SQLModel):
    """Schema for updating a note (PUT/PATCH request)"""
    title: Optional[str] = Field(default=None, max_length=200)
    content: Optional[str] = None
    is_public: Optional[bool] = None


class NoteResponse(NoteBase):
    """Schema for note responses (GET request)"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    owner_id: int
    is_public: bool
    share_token: Optional[str] = None


class NoteWithOwner(NoteResponse):
    """Note response with owner details"""
    owner: UserResponse




class ShareLinkResponse(SQLModel):
    """Response with shareable link"""
    share_token: str
    share_url: str
    note_id: int


class SharedNoteResponse(NoteBase):
    """Schema for publicly shared notes (via link)"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    


class ShareLinkResponse(SQLModel):
    """Response with shareable link"""
    share_token: str
    share_url: str
    note_id: int


class SharedNoteResponse(NoteBase):
    """Schema for publicly shared notes (via link) - no owner info exposed"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime]