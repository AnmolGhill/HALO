"""
Health Profile model - Firebase Firestore compatible
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any
from datetime import datetime
import uuid

class HealthProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    userId: str = Field(..., description="Reference to User ID")
    firebase_uid: Optional[str] = None  # Firebase Auth UID for additional reference
    name: Optional[str] = None
    email: EmailStr
    dob: Optional[str] = None
    gender: Optional[str] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    bloodType: Optional[str] = None
    conditions: Optional[str] = None
    medications: Optional[str] = None
    allergies: Optional[str] = None
    emergencyName: Optional[str] = None
    emergencyRelation: Optional[str] = None
    emergencyPhone: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for Firestore"""
        data = self.model_dump()
        return data
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'HealthProfile':
        """Create HealthProfile from Firestore document"""
        return cls(**data)

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "userId": "user-uuid-here",
                "name": "John Doe",
                "email": "john@example.com",
                "dob": "1990-01-01",
                "gender": "male",
                "weight": 70.5,
                "height": 175.0,
                "bloodType": "O+",
                "conditions": "None",
                "medications": "None",
                "allergies": "None",
                "emergencyName": "Jane Doe",
                "emergencyRelation": "Spouse",
                "emergencyPhone": "+1234567890"
            }
        }

class HealthProfileCreate(BaseModel):
    userId: str
    firebase_uid: Optional[str] = None
    name: Optional[str] = None
    email: EmailStr
    dob: Optional[str] = None
    gender: Optional[str] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    bloodType: Optional[str] = None
    conditions: Optional[str] = None
    medications: Optional[str] = None
    allergies: Optional[str] = None
    emergencyName: Optional[str] = None
    emergencyRelation: Optional[str] = None
    emergencyPhone: Optional[str] = None

class HealthProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    bloodType: Optional[str] = None
    conditions: Optional[str] = None
    medications: Optional[str] = None
    allergies: Optional[str] = None
    emergencyName: Optional[str] = None
    emergencyRelation: Optional[str] = None
    emergencyPhone: Optional[str] = None
    updatedAt: datetime = Field(default_factory=datetime.utcnow)
