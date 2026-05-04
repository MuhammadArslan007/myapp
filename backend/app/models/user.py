from pydantic import BaseModel, EmailStr
from typing import Optional


class UserLogin(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str
    role: str


class ContactMessageSchema(BaseModel):
    name: str
    email: EmailStr
    subject: Optional[str] = "General Inquiry"
    message: str
