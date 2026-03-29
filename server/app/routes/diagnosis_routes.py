"""
Diagnosis routes - matches Node.js diagnosisRoutes.js exactly
"""
from fastapi import APIRouter, HTTPException, status, Depends
from app.models.diagnosis import DiagnosisRequest, DiagnosisResponse
from app.services.gemini_service import gemini_service
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["🤖 AI Medical Diagnosis"])

@router.post("/get_diagnosis", response_model=DiagnosisResponse)
async def get_diagnosis(request: DiagnosisRequest):
    """
    Get AI diagnosis from Gemini - matches Node.js /get_diagnosis route exactly
    """
    try:
        if not request.symptoms.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No symptoms provided"
            )
        
        # Get diagnosis from Gemini AI with language support
        diagnosis_html = await gemini_service.get_diagnosis(request.symptoms, request.language or "en")
        
        if not diagnosis_html:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="No response from Gemini API"
            )
        
        logger.info(f"✅ Diagnosis generated for symptoms: {request.symptoms[:50]}...")
        
        return DiagnosisResponse(response=diagnosis_html)
        
    except HTTPException:
        raise
    except Exception as e:
        error_str = str(e)
        
        # Handle quota exceeded specifically
        if "QUOTA_EXCEEDED" in error_str:
            logger.info(f"ℹ️ Switching to intelligent fallback system for user request")
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="QUOTA_EXCEEDED"
            )
        else:
            logger.error(f"❌ Gemini API error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to get diagnosis"
            )

@router.post("/test-ai")
async def test_ai():
    """
    Test Gemini AI connection - matches Node.js /test-ai route exactly
    """
    try:
        response = await gemini_service.test_ai_connection()
        return {"message": response}
        
    except Exception as e:
        logger.error(f"❌ Gemini AI test failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Gemini AI test failed"
        )
