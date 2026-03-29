"""
Authentication routes - Firebase Authentication compatible (Fixed)
"""
from fastapi import APIRouter, HTTPException, status
from app.models.user import UserCreate, UserLogin, UserResponse
from app.models.otp import SendOTPRequest, OTPVerify, ResetPasswordRequest
from app.utils.auth import get_password_hash, verify_password, create_access_token
from app.utils.otp_generator import generate_otp, is_otp_expired
from app.utils.email_service import email_service
from app.services.firebase_service import firebase_service
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/auth", tags=["🔐 Authentication & Security"])

@router.post(
    "/register", 
    response_model=UserResponse,
    summary="👤 Register New User",
    description="Create a new user account (Legacy - Use Firebase Auth instead)"
)
async def register_user(user_data: UserCreate):
    """
    ## 👤 Register New User Account (Legacy)
    
    **Note**: This is a legacy endpoint. For new applications, use Firebase Authentication 
    endpoints at `/api/firebase-auth/` instead.
    """
    try:
        # Check if user already exists
        existing_user = await firebase_service.get_user_by_email(user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already exists"
            )
        
        # Hash password for legacy users
        hashed_password = get_password_hash(user_data.password) if user_data.password else None
        
        # Create new user in Firestore
        from app.models.user import User
        new_user = User(
            name=user_data.name,
            email=user_data.email,
            password=hashed_password,
            age=user_data.age,
            createdAt=datetime.utcnow()
        )
        
        # Save to Firestore
        db = firebase_service.db
        user_ref = db.collection('users').document(new_user.id)
        user_ref.set(new_user.to_dict())
        
        logger.info(f"✅ User registered successfully: {user_data.email}")
        
        return UserResponse(
            userId=new_user.id,
            name=user_data.name,
            email=user_data.email,
            message="User registered successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Registration error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )

@router.post(
    "/login", 
    response_model=dict,
    summary="🔑 Login User",
    description="Login user with email and password (Legacy - Use Firebase Auth instead)"
)
async def login_user(user_data: UserLogin):
    """
    ## 🔑 Login User (Legacy)
    
    **Note**: This is a legacy endpoint. For new applications, use Firebase Authentication instead.
    """
    try:
        # Find user by email
        user = await firebase_service.get_user_by_email(user_data.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Verify password
        if not user.password or not verify_password(user_data.password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Create access token
        access_token = create_access_token(data={"sub": user.email})
        
        logger.info(f"✅ User logged in successfully: {user_data.email}")
        
        return {
            "success": True,
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Login error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )

@router.post(
    "/send-otp",
    summary="📧 Send OTP",
    description="Send OTP to email for password reset"
)
async def send_otp(request: SendOTPRequest):
    """Send OTP to email for password reset"""
    try:
        # Check if user exists
        user = await firebase_service.get_user_by_email(request.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Generate OTP
        otp_code = generate_otp()
        
        # Save OTP to Firestore
        from app.models.otp import OTP
        otp_record = OTP(
            email=request.email,
            otp=otp_code
        )
        
        db = firebase_service.db
        otp_ref = db.collection('otps').document(otp_record.id)
        otp_ref.set(otp_record.to_dict())
        
        # Send email
        await email_service.send_otp_email(request.email, otp_code)
        
        logger.info(f"✅ OTP sent successfully to: {request.email}")
        
        return {"message": "OTP sent successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Send OTP error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send OTP"
        )

@router.post(
    "/verify-otp",
    summary="✅ Verify OTP",
    description="Verify OTP for password reset"
)
async def verify_otp(request: OTPVerify):
    """Verify OTP for password reset"""
    try:
        # Find OTP record
        db = firebase_service.db
        otps_ref = db.collection('otps')
        query = otps_ref.where('email', '==', request.email).where('otp', '==', request.otp).limit(1)
        docs = query.stream()
        
        otp_doc = None
        for doc in docs:
            otp_doc = doc
            break
        
        if not otp_doc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid OTP"
            )
        
        otp_data = otp_doc.to_dict()
        
        # Check if OTP is expired
        if is_otp_expired(otp_data.get('expiresAt')):
            # Delete expired OTP
            otp_doc.reference.delete()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="OTP has expired"
            )
        
        # Delete used OTP
        otp_doc.reference.delete()
        
        logger.info(f"✅ OTP verified successfully for: {request.email}")
        
        return {"message": "OTP verified successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Verify OTP error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="OTP verification failed"
        )

@router.post(
    "/reset-password",
    summary="🔄 Reset Password",
    description="Reset user password"
)
async def reset_password(request: ResetPasswordRequest):
    """Reset user password"""
    try:
        # Find user
        user = await firebase_service.get_user_by_email(request.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Hash new password
        hashed_password = get_password_hash(request.newPassword)
        
        # Update user password in Firestore
        db = firebase_service.db
        user_ref = db.collection('users').document(user.id)
        user_ref.update({'password': hashed_password})
        
        logger.info(f"✅ Password reset successfully for: {request.email}")
        
        return {"message": "Password reset successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Reset password error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Password reset failed"
        )
