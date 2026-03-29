import React, { useEffect, useState } from 'react';

const FirebaseConfig = () => {
  const [configStatus, setConfigStatus] = useState('checking');
  const [missingVars, setMissingVars] = useState([]);

  useEffect(() => {
    // Check if Firebase environment variables are configured
    const requiredVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID'
    ];

    const missing = requiredVars.filter(varName => !import.meta.env[varName]);
    
    if (missing.length > 0) {
      setMissingVars(missing);
      setConfigStatus('missing');
    } else {
      setConfigStatus('configured');
    }
  }, []);

  if (configStatus === 'checking') {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3>Checking Firebase Configuration...</h3>
        </div>
      </div>
    );
  }

  if (configStatus === 'missing') {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          maxWidth: '600px',
          margin: '1rem'
        }}>
          <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>
            🔥 Firebase Configuration Missing
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            The following Firebase environment variables are not configured:
          </p>
          <ul style={{ 
            textAlign: 'left', 
            backgroundColor: '#f3f4f6', 
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            {missingVars.map(varName => (
              <li key={varName} style={{ fontFamily: 'monospace', color: '#dc2626' }}>
                {varName}
              </li>
            ))}
          </ul>
          <div style={{ textAlign: 'left', fontSize: '0.9rem', color: '#6b7280' }}>
            <p><strong>To fix this:</strong></p>
            <ol>
              <li>Create a <code>.env</code> file in the client directory</li>
              <li>Copy the contents from <code>.env.example</code></li>
              <li>Fill in your Firebase project configuration values</li>
              <li>Restart the development server</li>
            </ol>
            <p style={{ marginTop: '1rem' }}>
              See <code>FIREBASE_SETUP.md</code> for detailed instructions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null; // Firebase is properly configured
};

export default FirebaseConfig;
