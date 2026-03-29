"""
Firebase service for authentication and Firestore operations
"""
from firebase_admin import auth, firestore
from app.database import get_firestore_db, get_firebase_auth
from app.models.user import User, UserCreate
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

class FirebaseService:
    def __init__(self):
        self.db = get_firestore_db()
        self.auth = get_firebase_auth()
    
    async def verify_firebase_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify Firebase ID token and return user info"""
        try:
            decoded_token = self.auth.verify_id_token(token)
            return decoded_token
        except Exception as e:
            logger.error(f"Error verifying Firebase token: {e}")
            return None
    
    async def create_user_in_firestore(self, user_data: UserCreate, firebase_uid: str) -> User:
        """Create user document in Firestore"""
        try:
            user = User(
                firebase_uid=firebase_uid,
                name=user_data.name,
                age=user_data.age,
                email=user_data.email
            )
            
            # Save to Firestore
            user_ref = self.db.collection('users').document(user.id)
            user_ref.set(user.to_dict())
            
            logger.info(f"User created in Firestore: {user.email}")
            return user
            
        except Exception as e:
            logger.error(f"Error creating user in Firestore: {e}")
            raise e
    
    async def get_user_by_firebase_uid(self, firebase_uid: str) -> Optional[User]:
        """Get user by Firebase UID"""
        try:
            users_ref = self.db.collection('users')
            query = users_ref.where('firebase_uid', '==', firebase_uid).limit(1)
            docs = query.stream()
            
            for doc in docs:
                return User.from_dict(doc.to_dict())
            
            return None
            
        except Exception as e:
            logger.error(f"Error getting user by Firebase UID: {e}")
            return None
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        try:
            users_ref = self.db.collection('users')
            query = users_ref.where('email', '==', email).limit(1)
            docs = query.stream()
            
            for doc in docs:
                return User.from_dict(doc.to_dict())
            
            return None
            
        except Exception as e:
            logger.error(f"Error getting user by email: {e}")
            return None
    
    async def update_user(self, user_id: str, update_data: Dict[str, Any]) -> bool:
        """Update user document in Firestore"""
        try:
            user_ref = self.db.collection('users').document(user_id)
            user_ref.update(update_data)
            logger.info(f"User updated: {user_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error updating user: {e}")
            return False
    
    async def delete_user(self, user_id: str) -> bool:
        """Delete user document from Firestore"""
        try:
            user_ref = self.db.collection('users').document(user_id)
            user_ref.delete()
            logger.info(f"User deleted: {user_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting user: {e}")
            return False

# Global Firebase service instance
firebase_service = FirebaseService()
