"""
Diagnosis model for AI-powered symptom analysis - Firebase Firestore compatible
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

class DiagnosisRequest(BaseModel):
    symptoms: str = Field(..., description="Comma-separated list of symptoms")
    language: Optional[str] = Field(default="en", description="Language code for response (en, hi, pa, or)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "symptoms": "headache, fever, cough, fatigue",
                "language": "en"
            }
        }

class DiagnosisResponse(BaseModel):
    response: str = Field(..., description="HTML formatted diagnosis response")
    
    class Config:
        json_schema_extra = {
            "example": {
                "response": "<div><h3>Diagnosis Summary</h3><p>Based on your symptoms...</p></div>"
            }
        }

class Diagnosis(BaseModel):
    """Diagnosis record for storing in Firestore"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    userId: str = Field(..., description="Reference to User ID")
    firebase_uid: Optional[str] = None  # Firebase Auth UID
    symptoms: str = Field(..., description="Symptoms provided by user")
    diagnosis: str = Field(..., description="AI-generated diagnosis")
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for Firestore"""
        return self.model_dump()
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Diagnosis':
        """Create Diagnosis from Firestore document"""
        return cls(**data)
    
    class Config:
        json_schema_extra = {
            "example": {
                "userId": "user-uuid-here",
                "symptoms": "headache, fever, cough, fatigue",
                "diagnosis": "Based on your symptoms, you may have a viral infection..."
            }
        }
