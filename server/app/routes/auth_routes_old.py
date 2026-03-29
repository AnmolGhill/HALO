"""
Authentication routes - Firebase Authentication compatible
"""
from fastapi import APIRouter, HTTPException, status
from app.models.user import UserCreate, UserLogin, UserResponse
from app.models.otp import SendOTPRequest, OTPVerify, ResetPasswordRequest
from app.utils.auth import get_password_hash, verify_password
from app.utils.otp_generator import generate_otp, is_otp_expired
from app.utils.email_service import email_service
from app.services.firebase_service import firebase_service
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/auth", tags=["🔐 Authentication & Security"])

@router.post(
    "/register", 
    description="Create a new user account with secure password hashing (Legacy - Use Firebase Auth instead)"
)
async def register_user(user_data: UserCreate):
    """
    ## 👤 Register New User Account (Legacy)
    
    **Note**: This is a legacy endpoint. For new applications, use Firebase Authentication 
    endpoints at `/api/firebase-auth/` instead.
    
    Create a new user account in Firestore with:
    - 🔒 **Secure Password Hashing** using bcrypt
    - ✅ **Email Validation** and uniqueness check
    - 📝 **User Profile Creation** with basic information
    - 🛡️ **Data Validation** for all input fields
    
    ### Required Information:
    - **Name**: Full name (minimum 3 characters)
    - **Email**: Valid email address (unique)
    - **Password**: Secure password (minimum 6 characters)
    - **Age**: Age between 17-45 years
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

@router.post("/login", response_model=UserResponse)
async def login_user(user_data: UserLogin, db=Depends(get_database)):
    """Login user - matches Node.js login route exactly"""
    try:
        # Find user
        user = await db.users.find_one({"email": user_data.email})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid credentials"
            )
        
        # Verify password
        if not verify_password(user_data.password, user["password"]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid credentials"
            )
        
        logger.info(f"✅ User logged in successfully: {user_data.email}")
        
        return UserResponse(
            message="Login successful",
            email=user["email"],
            name=user["name"],
            userId=str(user["_id"])
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Login error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )

@router.post("/send-otp")
async def send_otp(request: SendOTPRequest, db=Depends(get_database)):
    """Send OTP - matches Node.js send-otp route exactly"""
    try:
        # Generate OTP
        otp_code = generate_otp()
        
        # Store OTP in database
        otp_data = {
            "email": request.email,
            "otp": otp_code,
            "createdAt": datetime.utcnow()
        }
        
        # Upsert OTP (update if exists, insert if not)
        await db.otps.replace_one(
            {"email": request.email},
            otp_data,
            upsert=True
        )
        
        # Send email
        email_sent = await email_service.send_otp_email(request.email, otp_code)
        
        if not email_sent:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to send OTP"
            )
        
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

@router.post("/verify-otp")
async def verify_otp(request: OTPVerify, db=Depends(get_database)):
    """Verify OTP - matches Node.js verify-otp route exactly"""
    try:
        # Find OTP record
        otp_record = await db.otps.find_one({"email": request.email})
        if not otp_record:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="OTP not found"
            )
        
        # Check if OTP matches
        if otp_record["otp"] != request.otp:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid OTP"
            )
        
        # Check if OTP is expired (5 minutes)
        if is_otp_expired(otp_record["createdAt"], 5):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="OTP expired"
            )
        
        # Delete OTP after successful verification
        await db.otps.delete_one({"email": request.email})
        
        logger.info(f"✅ OTP verified successfully for: {request.email}")
        
        return {"message": "OTP verified successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Verify OTP error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to verify OTP"
        )

@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest, db=Depends(get_database)):
    """Reset password - matches Node.js reset-password route exactly"""
    try:
        # Find user
        user = await db.users.find_one({"email": request.email})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Hash new password
        hashed_password = get_password_hash(request.newPassword)
        
        # Update user password
        await db.users.update_one(
            {"email": request.email},
            {"$set": {"password": hashed_password}}
        )
        
        logger.info(f"✅ Password reset successfully for: {request.email}")
        
        return {"message": "Password reset successful"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Reset password error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to reset password"
        )
