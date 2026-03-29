// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection, 
  query, 
  where, 
  getDocs,
  addDoc,
  serverTimestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';

// Firebase configuration
// Working demo Firebase project for testing
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDHnKwbPjGpP8b5K1YQHvdMlmhK8Z9x2Y3cA',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'fir-demo-project-1234.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'fir-demo-project-1234',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'fir-demo-project-1234.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:abcd1234efgh5678ijkl'
};

// Check if Firebase is properly configured
const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_API_KEY && 
                             import.meta.env.VITE_FIREBASE_PROJECT_ID &&
                             !import.meta.env.VITE_FIREBASE_API_KEY.includes('mock');

// Enable real Firebase for authentication (disable mock mode)
const useMockFirebase = false; // Changed to false to enable real Firebase

if (useMockFirebase) {
  console.log('🔧 Development mode: Using mock Firebase service');
} else {
  console.log('🔥 Production mode: Using real Firebase service');
}

// Conditionally initialize Firebase only in production
let app, auth, db, storage, googleProvider;

if (useMockFirebase) {
  // Development mode - no Firebase initialization
  console.log('🔧 Development: Skipping Firebase initialization completely');
  auth = null;
  db = null;
  storage = null;
  googleProvider = null;
} else {
  // Production mode - initialize Firebase
  console.log('🔥 Production: Initializing Firebase');
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  googleProvider = new GoogleAuthProvider();
  
  // Set authentication persistence to session only (won't persist after browser close)
  try {
    setPersistence(auth, browserSessionPersistence);
    console.log('🔒 Firebase auth persistence set to session only');
  } catch (error) {
    console.warn('Failed to set auth persistence:', error);
  }
}

// Export the services
export { auth, db, storage };

// Firebase Auth Service
export const firebaseAuthService = {
  // Register with email and password
  registerWithEmail: async (email, password) => {
    if (useMockFirebase) {
      console.log('🔧 Mock: registerWithEmail');
      return { 
        success: true, 
        user: {
          uid: 'mock_registered_user',
          email: email,
          displayName: 'Mock User',
          photoURL: null
        }
      };
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Sign in with email and password
  signInWithEmail: async (email, password) => {
    if (useMockFirebase) {
      console.log('🔧 Mock: signInWithEmail');
      return { 
        success: true, 
        user: {
          uid: 'mock_email_user',
          email: email,
          displayName: 'Mock Email User',
          photoURL: null
        }
      };
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    if (useMockFirebase) {
      console.log('🔧 Mock Google login - bypassing Firebase completely');
      return { 
        success: true, 
        user: {
          uid: 'mock_google_user_123',
          email: 'mock.google@halo.com',
          displayName: 'Mock Google User',
          photoURL: 'https://via.placeholder.com/150/667eea/ffffff?text=👤',
          metadata: {
            creationTime: new Date().toISOString()
          }
        }
      };
    }

    try {
      console.log('🔥 Real Firebase Google authentication');
      
      // Configure Google provider
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });
      
      // Add additional parameters to reduce COOP issues
      googleProvider.addScope('email');
      googleProvider.addScope('profile');
      
      const result = await signInWithPopup(auth, googleProvider);
      console.log('✅ Google sign-in successful:', result.user.email);
      
      return { success: true, user: result.user };
    } catch (error) {
      console.error('❌ Google sign-in error:', error);
      
      // Handle specific error cases
      if (error.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Sign-in was cancelled' };
      } else if (error.code === 'auth/popup-blocked') {
        return { success: false, error: 'Popup was blocked by browser' };
      } else {
        return { success: false, error: error.message };
      }
    }
  },

  // Sign out
  signOut: async () => {
    if (useMockFirebase) {
      console.log('🔧 Mock: signOut');
      return { success: true };
    }
    try {
      await firebaseSignOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get current user
  getCurrentUser: () => {
    if (useMockFirebase) {
      return null; // No persistent user in mock
    }
    return auth?.currentUser;
  },

  // Get Firebase ID token
  getIdToken: async () => {
    if (useMockFirebase) {
      return { success: false, error: 'Mock service - no token' };
    }
    try {
      if (!isFirebaseConfigured) {
        return { success: false, error: 'Firebase not configured' };
      }
      
      const user = auth?.currentUser;
      if (user) {
        const token = await user.getIdToken();
        return { success: true, token };
      }
      return { success: false, error: 'No user logged in' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Auth state change listener
  onAuthStateChanged: (callback) => {
    if (useMockFirebase) {
      console.log('🔧 Mock: onAuthStateChanged listener registered');
      // Return empty unsubscribe function
      return () => {};
    }
    return onAuthStateChanged(auth, callback);
  }
};

// Firestore Service
export const firestoreService = {
  // Create user document
  createUserDocument: async (userId, userData) => {
    try {
      await setDoc(doc(db, 'users', userId), userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user document
  getUserDocument: async (userId) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, data: docSnap.data() };
      } else {
        return { success: false, error: 'User document not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user by email
  getUserByEmail: async (email) => {
    try {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { success: true, data: { id: doc.id, ...doc.data() } };
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update user document
  updateUserDocument: async (userId, userData) => {
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, {
        ...userData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Create or update user profile
  saveUserProfile: async (userId, profileData) => {
    try {
      const docRef = doc(db, 'users', userId);
      await setDoc(docRef, {
        ...profileData,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      }, { merge: true });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Profile Service for comprehensive user data management
export const profileService = {
  // Get complete user profile
  getUserProfile: async (userId) => {
    try {
      const userDoc = await firestoreService.getUserDocument(userId);
      if (!userDoc.success) {
        return userDoc;
      }

      // Get health data
      const healthDoc = await getDoc(doc(db, 'healthProfiles', userId));
      const healthData = healthDoc.exists() ? healthDoc.data() : {};

      // Get activity data
      const activityQuery = query(
        collection(db, 'userActivity', userId, 'activities'),
        orderBy('timestamp', 'desc'),
        limit(10)
      );
      const activitySnapshot = await getDocs(activityQuery);
      const activities = activitySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Get settings
      const settingsDoc = await getDoc(doc(db, 'userSettings', userId));
      const settings = settingsDoc.exists() ? settingsDoc.data() : {
        notifications: {
          healthReminders: true,
          appointmentAlerts: true,
          medicationReminders: false
        },
        privacy: {
          profileVisibility: 'private',
          dataSharing: false
        }
      };

      return {
        success: true,
        data: {
          profile: userDoc.data,
          health: healthData,
          activities: activities,
          settings: settings
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update health profile
  updateHealthProfile: async (userId, healthData) => {
    try {
      const docRef = doc(db, 'healthProfiles', userId);
      await setDoc(docRef, {
        ...healthData,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Add activity record
  addActivity: async (userId, activityData) => {
    try {
      const collectionRef = collection(db, 'userActivity', userId, 'activities');
      await addDoc(collectionRef, {
        ...activityData,
        timestamp: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update user settings
  updateSettings: async (userId, settings) => {
    try {
      const docRef = doc(db, 'userSettings', userId);
      await setDoc(docRef, {
        ...settings,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Upload profile picture
  uploadProfilePicture: async (userId, file) => {
    try {
      const storageRef = ref(storage, `profilePictures/${userId}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Update user document with new photo URL
      await firestoreService.updateUserDocument(userId, {
        photoURL: downloadURL
      });
      
      return { success: true, url: downloadURL };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Add medical history entry
  addMedicalHistory: async (userId, historyEntry) => {
    try {
      const collectionRef = collection(db, 'medicalHistory', userId, 'entries');
      await addDoc(collectionRef, {
        ...historyEntry,
        timestamp: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get medical history
  getMedicalHistory: async (userId) => {
    try {
      const historyQuery = query(
        collection(db, 'medicalHistory', userId, 'entries'),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(historyQuery);
      const history = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { success: true, data: history };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Save user profile (wrapper for firestoreService method)
  saveUserProfile: async (userId, profileData) => {
    return await firestoreService.saveUserProfile(userId, profileData);
  }
};

export default app;
