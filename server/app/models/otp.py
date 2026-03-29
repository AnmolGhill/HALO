"""
OTP model - Firebase Firestore compatible
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import uuid

class OTP(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    expiresAt: datetime = Field(default_factory=lambda: datetime.utcnow() + timedelta(minutes=10))
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for Firestore"""
        return self.model_dump()
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'OTP':
        """Create OTP from Firestore document"""
        return cls(**data)
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "otp": "123456"
            }
        }

class OTPCreate(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)

class OTPVerify(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)

class SendOTPRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    newPassword: str = Field(..., min_length=6)
