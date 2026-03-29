"""
Health profile routes - matches Node.js healthRoutes.js exactly
"""
from fastapi import APIRouter, HTTPException, status, Depends, Query
from app.models.health_profile import HealthProfileCreate, HealthProfileUpdate
from app.services.firebase_service import firebase_service
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["👤 Health Profile Management"])

@router.post("/update-health")
async def update_health_profile(profile_data: HealthProfileCreate):
    """
    Save or update health profile - matches Node.js /update-health route exactly
    """
    try:
        if not profile_data.userId:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="userId is required"
            )
        
        # Save to Firestore
        profile_dict = profile_data.dict(exclude_unset=True)
        profile_dict["updatedAt"] = datetime.utcnow()
        
        # Save to Firestore (merge=True will update existing or create new)
        db = firebase_service.db
        profile_ref = db.collection('health_profiles').document(profile_data.userId)
        profile_ref.set(profile_dict, merge=True)
        
        logger.info(f"✅ Health profile saved for user: {profile_data.userId}")
        
        return {"message": "Profile saved successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error saving profile: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save profile"
        )

@router.get("/user-health")
async def get_user_health(userId: str = Query(..., description="User ID")):
    """
    Load health profile by userId - matches Node.js /user-health route exactly
    """
    try:
        if not userId:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="userId is required"
            )
        
        # Find health profile in Firestore
        db = firebase_service.db
        profile_ref = db.collection('health_profiles').document(userId)
        profile_doc = profile_ref.get()
        
        if not profile_doc.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found"
            )
        
        profile = profile_doc.to_dict()
        profile["userId"] = userId  # Add userId to response
        
        logger.info(f"✅ Health profile loaded for user: {userId}")
        
        return profile
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error loading profile: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to load profile"
        )
