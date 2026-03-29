"""
Firebase Authentication routes
"""
from fastapi import APIRouter, HTTPException, status
from app.models.user import UserCreate, UserResponse, FirebaseTokenVerify
from app.services.firebase_service import firebase_service
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/firebase-auth", tags=["🔥 Firebase Authentication"])

@router.post(
    "/verify-token",
    response_model=UserResponse,
    summary="🔥 Verify Firebase Token",
    description="Verify Firebase ID token and create/get user profile"
)
async def verify_firebase_token(token_data: FirebaseTokenVerify):
    """
    ## 🔥 Verify Firebase ID Token
    
    Verify Firebase ID token and create user profile if it doesn't exist:
    - 🔐 **Token Verification** using Firebase Admin SDK
    - 👤 **User Profile Creation** for new users
    - 📝 **User Data Sync** with Firestore
    - ✅ **Authentication Success** response
    
    ### Required Information:
    - **firebase_token**: Valid Firebase ID token
    """
    try:
        # Verify Firebase token
        decoded_token = await firebase_service.verify_firebase_token(token_data.firebase_token)
        if not decoded_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Firebase token"
            )
        
        firebase_uid = decoded_token.get('uid')
        email = decoded_token.get('email')
        name = decoded_token.get('name', email.split('@')[0])
        
        # Check if user exists in Firestore
        existing_user = await firebase_service.get_user_by_firebase_uid(firebase_uid)
        
        if existing_user:
            return UserResponse(
                userId=existing_user.id,
                firebase_uid=existing_user.firebase_uid,
                name=existing_user.name,
                email=existing_user.email,
                message="User authenticated successfully"
            )
        
        # Create new user profile in Firestore
        user_data = UserCreate(
            name=name,
            age=25,  # Default age, can be updated later
            email=email
        )
        
        new_user = await firebase_service.create_user_in_firestore(user_data, firebase_uid)
        
        return UserResponse(
            userId=new_user.id,
            firebase_uid=new_user.firebase_uid,
            name=new_user.name,
            email=new_user.email,
            message="User registered and authenticated successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Firebase authentication error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication failed"
        )

@router.post(
    "/register-with-profile",
    response_model=UserResponse,
    summary="👤 Register with Complete Profile",
    description="Register user with Firebase token and complete profile information"
)
async def register_with_profile(user_data: UserCreate, token_data: FirebaseTokenVerify):
    """
    ## 👤 Register User with Complete Profile
    
    Register user using Firebase token with complete profile information:
    - 🔐 **Token Verification** using Firebase Admin SDK
    - 👤 **Complete Profile Creation** with all user details
    - 📝 **Data Validation** for all input fields
    - ✅ **Registration Success** response
    
    ### Required Information:
    - **firebase_token**: Valid Firebase ID token
    - **name**: Full name (minimum 3 characters)
    - **age**: Age between 17-45 years
    - **email**: Valid email address (from Firebase token)
    """
    try:
        # Verify Firebase token
        decoded_token = await firebase_service.verify_firebase_token(token_data.firebase_token)
        if not decoded_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Firebase token"
            )
        
        firebase_uid = decoded_token.get('uid')
        token_email = decoded_token.get('email')
        
        # Ensure email matches token
        if user_data.email != token_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email doesn't match Firebase token"
            )
        
        # Check if user already exists
        existing_user = await firebase_service.get_user_by_firebase_uid(firebase_uid)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already exists"
            )
        
        # Create new user with complete profile
        new_user = await firebase_service.create_user_in_firestore(user_data, firebase_uid)
        
        return UserResponse(
            userId=new_user.id,
            firebase_uid=new_user.firebase_uid,
            name=new_user.name,
            email=new_user.email,
            message="User registered successfully with complete profile"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )
