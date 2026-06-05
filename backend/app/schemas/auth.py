# ========================================
# Auth Schemas — Pydantic validation
# ========================================

from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from uuid import UUID


class RegisterRequest(BaseModel):
    """Schema for user registration."""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)


class LoginRequest(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class ChangePasswordRequest(BaseModel):
    """Schema for password change."""
    current_password: str
    new_password: str = Field(..., min_length=6, max_length=128)


class TokenResponse(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    """Schema for user data response."""
    id: UUID
    name: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True
