import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { testConnection } from '../services/api';

const BackendStatus = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [isBackendAvailable, setIsBackendAvailable] = useState(true);

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const result = await testConnection();
        if (!result.success) {
          setIsBackendAvailable(false);
          setShowWarning(true);
        } else {
          setIsBackendAvailable(true);
          setShowWarning(false);
        }
      } catch (error) {
        setIsBackendAvailable(false);
        setShowWarning(true);
      }
    };

    // Check immediately
    checkBackendStatus();

    // Check every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!showWarning || isBackendAvailable) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      backgroundColor: '#fef3c7',
      border: '1px solid #f59e0b',
      borderRadius: '8px',
      padding: '1rem',
      maxWidth: '400px',
      zIndex: 1000,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      animation: 'slideInRight 0.3s ease-out'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <FontAwesomeIcon 
          icon={faInfoCircle} 
          style={{ color: '#f59e0b', marginTop: '2px', flexShrink: 0 }} 
        />
        <div style={{ flex: 1 }}>
          <h4 style={{ 
            margin: '0 0 0.5rem 0', 
            color: '#92400e', 
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            Limited Functionality
          </h4>
          <p style={{ 
            margin: 0, 
            color: '#92400e', 
            fontSize: '0.8rem',
            lineHeight: '1.4'
          }}>
            Backend server is not available. Firebase authentication works, but some features may be limited.
          </p>
        </div>
        <button
          onClick={() => setShowWarning(false)}
          style={{
            background: 'none',
            border: 'none',
            color: '#92400e',
            cursor: 'pointer',
            padding: '0',
            fontSize: '1rem',
            flexShrink: 0
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default BackendStatus;
