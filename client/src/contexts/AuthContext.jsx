import React, { createContext, useContext, useState, useEffect } from 'react';
import { firebaseAuthService } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true); // Start with true for development
  const [error, setError] = useState(null);

  // Initialize Firebase auth state listener
  useEffect(() => {
    console.log(' Initializing Firebase auth state listener');
    
    const unsubscribe = firebaseAuthService.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          console.log(' User signed in:', user.email);
          setCurrentUser(user);
          setUserProfile({
            name: user.displayName || 'User',
            email: user.email,
            firebase_uid: user.uid,
            photoURL: user.photoURL
          });
        } else {
          console.log(' No user signed in');
          setCurrentUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Sign in with email and password
  const signInWithEmail = async (email, password) => {
    try {
      setError(null);
      const result = await firebaseAuthService.signInWithEmail(email, password);
      if (result.success) {
        setCurrentUser(result.user);
        setUserProfile({
          name: result.user.displayName || 'User',
          email: result.user.email,
          firebase_uid: result.user.uid
        });
      } else {
        setError(result.error);
      }
      return result;
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await firebaseAuthService.signInWithGoogle();
      if (result.success) {
        setCurrentUser(result.user);
        setUserProfile({
          name: result.user.displayName || 'Google User',
          email: result.user.email,
          firebase_uid: result.user.uid
        });
        console.log(' Mock Google login successful');
      } else {
        setError(result.error);
      }
      return result;
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Register with email and password
  const registerWithEmail = async (email, password, displayName) => {
    try {
      setLoading(true);
      setError(null);
      const result = await firebaseAuthService.registerWithEmail(email, password);
      if (result.success) {
        setCurrentUser(result.user);
        setUserProfile({
          name: displayName || result.user.displayName || 'User',
          email: result.user.email,
          firebase_uid: result.user.uid
        });
      } else {
        setError(result.error);
      }
      return result;
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call Firebase signOut first
      const firebaseResult = await firebaseAuthService.signOut();
      if (!firebaseResult.success) {
        console.warn('Firebase signOut failed:', firebaseResult.error);
      }
      
      // Clear local state regardless of Firebase result
      setCurrentUser(null);
      setUserProfile(null);
      localStorage.removeItem('user');
      localStorage.clear(); // Clear all localStorage data
      
      console.log('🚪 Signed out successfully');
      return { success: true };
    } catch (error) {
      console.error('SignOut error:', error);
      setError(error.message);
      
      // Even if there's an error, clear local state
      setCurrentUser(null);
      setUserProfile(null);
      localStorage.removeItem('user');
      localStorage.clear();
      
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    signInWithEmail,
    signInWithGoogle,
    registerWithEmail,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
