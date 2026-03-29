// Development configuration for HALO
export const developmentConfig = {
  // API Configuration
  API_BASE_URL: 'http://localhost:8000',
  
  // Mock Firebase Configuration (for development when Firebase is not set up)
  FIREBASE_CONFIG: {
    apiKey: "mock-api-key-for-development",
    authDomain: "halo-dev.firebaseapp.com",
    projectId: "halo-dev",
    storageBucket: "halo-dev.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:mock-app-id"
  },
  
  // Development flags
  USE_MOCK_DATA: true,
  ENABLE_DEBUG_LOGS: true,
  SKIP_AUTH_FOR_TESTING: false
};

// Apply development config to environment if not already set
if (typeof window !== 'undefined') {
  // Set API base URL if not already configured
  if (!import.meta.env.VITE_API_BASE_URL) {
    window.__HALO_API_BASE_URL__ = developmentConfig.API_BASE_URL;
  }
  
  console.log('🔧 Development config loaded:', {
    apiUrl: developmentConfig.API_BASE_URL,
    mockData: developmentConfig.USE_MOCK_DATA
  });
}
