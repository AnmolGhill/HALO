import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import FirebaseConfig from './components/FirebaseConfig';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import BackendStatus from './components/BackendStatus';
import Home from './pages/Home';
import Health from './pages/Health';
import Chatbot from './pages/Chatbot';
import Doctor from './pages/Doctor';
import Medicine from './pages/Medicine';
import EQTest from './pages/EQTest';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Profile from './pages/Profile';
import './styles/global.css';
import './styles/health.css';
import './styles/chatbot.css';

// Toast component for notifications
const Toast = ({ message, type, onClose }) => {
  if (!message) return null;
  
  return (
    <div className={`toast ${type}`} style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: type === 'success' ? '#10b981' : '#ef4444',
      color: 'white',
      padding: '1rem 1.5rem',
      borderRadius: '8px',
      zIndex: 9999,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>{message}</span>
        <button 
          onClick={onClose}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'white', 
            cursor: 'pointer',
            fontSize: '1.2rem'
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <FirebaseConfig />
            <Navbar />
            <BackendStatus />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            
            {/* Public routes - redirect to home if already logged in */}
            <Route path="/login" element={
              <ProtectedRoute requireAuth={false}>
                <Login />
              </ProtectedRoute>
            } />
            <Route path="/register" element={
              <ProtectedRoute requireAuth={false}>
                <Register />
              </ProtectedRoute>
            } />
            
            {/* Protected routes - require authentication */}
            <Route path="/health" element={
              <ProtectedRoute>
                <Health />
              </ProtectedRoute>
            } />
            <Route path="/chatbot" element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            } />
            <Route path="/doctor" element={
              <ProtectedRoute>
                <Doctor />
              </ProtectedRoute>
            } />
            <Route path="/medicine" element={
              <ProtectedRoute>
                <Medicine />
              </ProtectedRoute>
            } />
            <Route path="/eqtest" element={
              <ProtectedRoute>
                <EQTest />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
