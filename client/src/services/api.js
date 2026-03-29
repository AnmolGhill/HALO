import axios from 'axios';
import { firebaseAuthService } from './firebase';
import { developmentConfig } from '../config/development.js';

// API base configuration - use development config if env var not set
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                    window.__HALO_API_BASE_URL__ || 
                    developmentConfig.API_BASE_URL;

// Debug logging to see what URL is being used
console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🌍 Environment Variables:', import.meta.env);

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Firebase auth token
api.interceptors.request.use(
  async (config) => {
    // Skip Firebase auth in development mode
    if (!import.meta.env.PROD || !import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY.includes('mock')) {
      // Development mode - no auth token needed
      console.log('🔧 Development mode: skipping Firebase auth');
      return config;
    }

    try {
      // Try to get Firebase ID token (only in production with real Firebase config)
      const tokenResult = await firebaseAuthService.getIdToken();
      if (tokenResult.success && tokenResult.token) {
        config.headers.Authorization = `Bearer ${tokenResult.token}`;
      } else {
        // Fallback to localStorage token for backward compatibility
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch (firebaseError) {
      console.warn('Firebase auth not available, continuing without token:', firebaseError.message);
      // Continue without auth token - server will use mock user
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the error for debugging but don't break the app
    console.warn('API Request failed:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message
    });

    if (error.response?.status === 401) {
      // Token expired or invalid - only redirect if it's a critical auth endpoint
      const isCriticalAuthEndpoint = error.config?.url?.includes('/auth/') || 
                                   error.config?.url?.includes('/firebase-auth/verify-token');
      
      if (isCriticalAuthEndpoint) {
        localStorage.removeItem('user');
        firebaseAuthService.signOut();
        window.location.href = '/login';
      }
    }
    
    // For CORS or network errors, provide a more user-friendly error
    if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
      error.userMessage = 'Backend server is not available. Some features may be limited.';
    }
    
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Health check
  healthCheck: () => api.get('/health'),
  
  // Authentication endpoints
  auth: {
    register: (userData) => api.post('/api/auth/register', userData),
    login: (credentials) => api.post('/api/auth/login', credentials),
    sendOTP: (email) => api.post('/api/auth/send-otp', { email }),
    verifyOTP: (email, otp) => api.post('/api/auth/verify-otp', { email, otp }),
  },

  // Firebase Authentication endpoints
  firebaseAuth: {
    verifyToken: (firebase_token) => api.post('/api/firebase-auth/verify-token', { firebase_token }),
    registerWithProfile: (userData, firebase_token) => api.post('/api/firebase-auth/register-with-profile', userData, {
      headers: { 'X-Firebase-Token': firebase_token }
    }),
  },
  
  // Health profile endpoints
  health: {
    updateProfile: (healthData) => api.post('/api/update-health', healthData),
    getProfile: () => api.get('/api/user-health'),
  },
  
  // Diagnosis endpoint
  diagnosis: {
    getDiagnosis: (symptoms) => api.post('/api/get_diagnosis', { symptoms }),
  },

  // Profile Management endpoints
  profile: {
    getCompleteProfile: (userId) => api.get(`/api/profile/complete/${userId}`),
    updatePersonalInfo: (userId, data) => api.put(`/api/profile/personal/${userId}`, data),
    updateHealthProfile: (userId, data) => api.put(`/api/profile/health/${userId}`, data),
    addActivity: (userId, data) => api.post(`/api/profile/activity/${userId}`, data),
    updateSettings: (userId, data) => api.put(`/api/profile/settings/${userId}`, data),
    uploadProfilePicture: (userId, file) => {
      const formData = new FormData();
      formData.append('file', file);
      return api.post(`/api/profile/upload-picture/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    addMedicalHistory: (userId, data) => api.post(`/api/profile/medical-history/${userId}`, data),
    getMedicalHistory: (userId) => api.get(`/api/profile/medical-history/${userId}`),
  },
};

// Utility function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.detail || error.response.data?.message || 'An error occurred';
    return { success: false, message, status: error.response.status };
  } else if (error.request) {
    // Request made but no response received
    return { success: false, message: 'Server is not responding. Please check your connection.', status: 0 };
  } else {
    // Something else happened
    return { success: false, message: error.message || 'An unexpected error occurred', status: 0 };
  }
};

// Test connection function
export const testConnection = async () => {
  try {
    const response = await apiService.healthCheck();
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

export default api;
