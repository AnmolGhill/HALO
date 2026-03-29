// Environment configuration for development
window.ENV = {
  VITE_API_BASE_URL: 'http://localhost:8000',
  VITE_FIREBASE_API_KEY: 'mock-api-key',
  VITE_FIREBASE_AUTH_DOMAIN: 'arogyaai-dev.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'arogyaai-dev',
  VITE_FIREBASE_STORAGE_BUCKET: 'arogyaai-dev.appspot.com',
  VITE_FIREBASE_MESSAGING_SENDER_ID: '123456789',
  VITE_FIREBASE_APP_ID: '1:123456789:web:mock-app-id'
};

console.log('🔧 Environment config loaded:', window.ENV);
