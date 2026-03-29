"""
User model - Firebase Firestore compatible
"""
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, Dict, Any
from datetime import datetime
import uuid

class OTPInfo(BaseModel):
    code: Optional[str] = None
    expiresAt: Optional[datetime] = None

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    firebase_uid: Optional[str] = None  # Firebase Auth UID
    name: str = Field(..., min_length=3)
    age: int = Field(..., ge=17, le=45)
    email: EmailStr
    password: Optional[str] = Field(None, min_length=6)  # Optional for Firebase Auth users
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    otp: Optional[OTPInfo] = None
    
    @field_validator('name')
    @classmethod
    def name_must_be_trimmed(cls, v):
        return v.strip()

    @field_validator('email')
    @classmethod
    def email_must_be_lowercase(cls, v):
        return v.lower().strip()

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for Firestore"""
        data = self.model_dump()
        # Convert datetime to timestamp for Firestore
        if data.get('createdAt'):
            data['createdAt'] = data['createdAt']
        if data.get('otp') and data['otp'].get('expiresAt'):
            data['otp']['expiresAt'] = data['otp']['expiresAt']
        return data
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'User':
        """Create User from Firestore document"""
        return cls(**data)

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "name": "John Doe",
                "age": 25,
                "email": "john@example.com",
                "password": "securepassword123"
            }
        }

class UserCreate(BaseModel):
    name: str = Field(..., min_length=3)
    age: int = Field(..., ge=17, le=45)
    email: EmailStr
    password: Optional[str] = Field(None, min_length=6)  # Optional for Firebase Auth

    @field_validator('name')
    @classmethod
    def name_must_be_trimmed(cls, v):
        return v.strip()

    @field_validator('email')
    @classmethod
    def email_must_be_lowercase(cls, v):
        return v.lower().strip()

class UserLogin(BaseModel):
    email: EmailStr
    password: Optional[str] = None  # Optional for Firebase Auth
    firebase_token: Optional[str] = None  # Firebase ID token

    @field_validator('email')
    @classmethod
    def email_must_be_lowercase(cls, v):
        return v.lower().strip()

class UserResponse(BaseModel):
    userId: str
    firebase_uid: Optional[str] = None
    name: str
    email: str
    message: str

class FirebaseTokenVerify(BaseModel):
    firebase_token: str

class UserInDB(User):
    hashed_password: Optional[str] = None  # Optional for Firebase Auth users
