"""
Database connection and configuration for Firebase Firestore
"""
import firebase_admin
from firebase_admin import credentials, firestore, auth
from app.config import settings
import logging
import json

logger = logging.getLogger(__name__)

class FirebaseDatabase:
    db = None
    app = None

# Database instance
firebase_db = FirebaseDatabase()

async def connect_to_firebase():
    """Initialize Firebase connection"""
    try:
        # Create credentials from environment variables
        firebase_config = {
            "type": "service_account",
            "project_id": settings.FIREBASE_PROJECT_ID,
            "private_key_id": settings.FIREBASE_PRIVATE_KEY_ID,
            "private_key": settings.FIREBASE_PRIVATE_KEY,
            "client_email": settings.FIREBASE_CLIENT_EMAIL,
            "client_id": settings.FIREBASE_CLIENT_ID,
            "auth_uri": settings.FIREBASE_AUTH_URI,
            "token_uri": settings.FIREBASE_TOKEN_URI,
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": settings.FIREBASE_CLIENT_CERT_URL
        }
        
        # Initialize Firebase Admin SDK
        if not firebase_admin._apps:
            cred = credentials.Certificate(firebase_config)
            firebase_db.app = firebase_admin.initialize_app(cred)
        
        # Initialize Firestore
        firebase_db.db = firestore.client()
        
        # Test the connection by trying to access a collection
        test_ref = firebase_db.db.collection('test').limit(1)
        list(test_ref.stream())
        
        logger.info("✅ Firebase Firestore connected successfully")
        
    except Exception as e:
        logger.error(f"❌ Firebase connection error: {e}")
        raise e

async def close_firebase_connection():
    """Close Firebase connection"""
    try:
        if firebase_db.app:
            firebase_admin.delete_app(firebase_db.app)
            logger.info("🔌 Firebase connection closed")
    except Exception as e:
        logger.error(f"Error closing Firebase connection: {e}")

def get_firestore_db():
    """Get Firestore database instance"""
    return firebase_db.db

def get_firebase_auth():
    """Get Firebase Auth instance"""
    return auth
