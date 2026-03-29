// Mock Firebase service for development
console.log('🔧 Using Mock Firebase Service for Development');

// Mock Firebase Auth Service
export const firebaseAuthService = {
  // Register with email and password
  registerWithEmail: async (email, password) => {
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
  },

  // Sign in with email and password
  signInWithEmail: async (email, password) => {
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
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    console.log('🔧 Mock: Google login success');
    return { 
      success: true, 
      user: {
        uid: 'mock_google_user_123',
        email: 'mock.google@halo.com',
        displayName: 'Mock Google User',
        photoURL: 'https://via.placeholder.com/150/667eea/ffffff?text=User',
        metadata: {
          creationTime: new Date().toISOString()
        }
      }
    };
  },

  // Sign out
  signOut: async () => {
    console.log('🔧 Mock: signOut');
    return { success: true };
  },

  // Get current user
  getCurrentUser: () => {
    return null; // No persistent user in mock
  },

  // Get Firebase ID token
  getIdToken: async () => {
    return { success: false, error: 'Mock service - no token' };
  },

  // Auth state change listener
  onAuthStateChanged: (callback) => {
    console.log('🔧 Mock: onAuthStateChanged listener registered');
    // Return empty unsubscribe function
    return () => {};
  }
};

// Mock Firestore Service
export const firestoreService = {
  // Mock methods that return empty results
  getUserProfile: async (uid) => {
    console.log('🔧 Mock: getUserProfile');
    return { success: false, error: 'Mock service - use server API' };
  },

  saveUserProfile: async (uid, data) => {
    console.log('🔧 Mock: saveUserProfile');
    return { success: false, error: 'Mock service - use server API' };
  },

  updateHealthProfile: async (uid, data) => {
    console.log('🔧 Mock: updateHealthProfile');
    return { success: false, error: 'Mock service - use server API' };
  },

  addActivity: async (uid, activity) => {
    console.log('🔧 Mock: addActivity');
    return { success: true };
  }
};

// Mock profile service
export const profileService = {
  getUserProfile: async (uid) => {
    console.log('🔧 Mock: profileService.getUserProfile');
    return { success: false, error: 'Mock service - use server API' };
  },

  saveUserProfile: async (uid, data) => {
    console.log('🔧 Mock: profileService.saveUserProfile');
    return { success: false, error: 'Mock service - use server API' };
  },

  updateHealthProfile: async (uid, data) => {
    console.log('🔧 Mock: profileService.updateHealthProfile');
    return { success: false, error: 'Mock service - use server API' };
  },

  addActivity: async (uid, activity) => {
    console.log('🔧 Mock: profileService.addActivity');
    return { success: true };
  }
};

// Mock exports to match real Firebase
export const auth = null;
export const db = null;
export const storage = null;
