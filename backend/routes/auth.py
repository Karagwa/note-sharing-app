from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from datetime import datetime, timedelta
import secrets
from backend.database import get_session
from backend.models import User
from backend.schemas import (
    UserCreate, UserResponse, Token,
    PasswordReset, PasswordResetConfirm, PasswordChange
)
from backend.auth.security import (
    get_password_hash, verify_password, create_access_token,
    get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
)
from backend.auth.email import send_password_reset_email, send_welcome_email

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, session: Session = Depends(get_session)):
    """Register a new user"""
    
    
    statement = select(User).where(User.username == user_data.username)
    existing_user = session.exec(statement).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    
    statement = select(User).where(User.email == user_data.email)
    existing_email = session.exec(statement).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    
    user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        created_at=datetime.utcnow()
    )
    
    session.add(user)
    session.commit()
    session.refresh(user)
    

    try:
        #send_welcome_email(user.email, user.username)
        print(f"Welcome email sent to {user.email}")
    except Exception as e:
        print(f"Failed to send welcome email: {e}")
    
    return user


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
):
    """
    Login with username and password
    OAuth2 compatible - accepts form data with 'username' and 'password'
    """
    
    
    statement = select(User).where(User.username == form_data.username)
    user = session.exec(statement).first()
    
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
   
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "user_id": user.id},
        expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            username=user.username,
            email=user.email,
            is_active=user.is_active,
            is_verified=user.is_verified,
            created_at=user.created_at
        )
    )


@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current authenticated user information"""
    return current_user


@router.post("/change-password")
def change_password(
    password_data: PasswordChange,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Change password for authenticated user"""
    
    
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    
    if verify_password(password_data.new_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from current password"
        )
    
   
    current_user.hashed_password = get_password_hash(password_data.new_password)
    session.add(current_user)
    session.commit()
    
    return {"ok": True, "message": "Password changed successfully"}


@router.post("/forgot-password")
def forgot_password(
    password_reset: PasswordReset,
    session: Session = Depends(get_session)
):
    """Request password reset - generates reset token"""
    
    
    statement = select(User).where(User.email == password_reset.email)
    user = session.exec(statement).first()
    
    
    if not user:
        return {
            "ok": True,
            "message": "If the email exists, a reset link has been sent"
        }
    
    
    reset_token = secrets.token_urlsafe(32)
    user.reset_token = reset_token
    user.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
    
    session.add(user)
    session.commit()
    
    
    try:
        email_sent = send_password_reset_email(user.email, reset_token, user.username)
        if email_sent:
            print(f"Password reset email sent to {user.email}")
        else:
            print(f"Email not configured. Password reset link:")
            print(f"   http://localhost:3000/reset-password?token={reset_token}")
    except Exception as e:
        print(f"Failed to send password reset email: {e}")
       
        print(f"   Reset Link: http://localhost:3000/reset-password?token={reset_token}")
    
    return {
        "ok": True,
        "message": "If the email exists, a reset link has been sent"
    }


@router.post("/reset-password")
def reset_password(
    reset_data: PasswordResetConfirm,
    session: Session = Depends(get_session)
):
    """Reset password using reset token"""
    
    
    statement = select(User).where(User.reset_token == reset_data.token)
    user = session.exec(statement).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    
    if user.reset_token_expires and user.reset_token_expires < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset token has expired"
        )
    
    
    user.hashed_password = get_password_hash(reset_data.new_password)
    user.reset_token = None
    user.reset_token_expires = None
    
    session.add(user)
    session.commit()
    
    return {"ok": True, "message": "Password reset successfully"}


@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    """
    Logout endpoint (client should delete the token)
    For JWT, there's no server-side session to invalidate
    """
    return {"ok": True, "message": "Logged out successfully"}