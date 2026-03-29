import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faSpinner, faServer } from '@fortawesome/free-solid-svg-icons';
import { testConnection } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const ConnectionTest = () => {
  const { t } = useLanguage();
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const [serverData, setServerData] = useState(null);
  const [error, setError] = useState(null);

  const checkConnection = async () => {
    setConnectionStatus('testing');
    setError(null);
    
    try {
      const result = await testConnection();
      
      if (result.success) {
        setConnectionStatus('connected');
        setServerData(result.data);
      } else {
        setConnectionStatus('failed');
        // Provide more helpful error messages
        if (result.message?.includes('CORS') || result.status === 0) {
          setError('Backend server is not configured or not running. Firebase authentication will still work.');
        } else {
          setError(result.message || 'Backend connection failed');
        }
      }
    } catch (err) {
      setConnectionStatus('failed');
      setError('Backend server is not available. App will work with limited functionality.');
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'testing':
        return <FontAwesomeIcon icon={faSpinner} spin className="text-blue-500" />;
      case 'connected':
        return <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />;
      case 'failed':
        return <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />;
      default:
        return <FontAwesomeIcon icon={faServer} className="text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'testing':
        return 'Testing connection...';
      case 'connected':
        return t('connected');
      case 'failed':
        return t('connectionFailed');
      default:
        return 'Unknown status';
    }
  };

  return (
    <div style={{
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '1rem',
      margin: '1rem 0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        {getStatusIcon()}
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>
          {t('serverConnection')}
        </h3>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>
          {getStatusText()}
        </p>
        {error && (
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#ef4444' }}>
            Error: {error}
          </p>
        )}
      </div>

      {serverData && (
        <div style={{ 
          background: '#f9fafb', 
          border: '1px solid #e5e7eb', 
          borderRadius: '6px', 
          padding: '0.75rem',
          marginBottom: '1rem'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: '600' }}>
            Server Information:
          </h4>
          <div style={{ fontSize: '0.8rem', color: '#374151' }}>
            <p style={{ margin: '0.25rem 0' }}>
              <strong>Service:</strong> {serverData.service || 'HALO Healthcare API'}
            </p>
            <p style={{ margin: '0.25rem 0' }}>
              <strong>Status:</strong> {serverData.status || 'Unknown'}
            </p>
            <p style={{ margin: '0.25rem 0' }}>
              <strong>Version:</strong> {serverData.version || 'Unknown'}
            </p>
            {serverData.message && (
              <p style={{ margin: '0.25rem 0' }}>
                <strong>Message:</strong> {serverData.message}
              </p>
            )}
          </div>
        </div>
      )}

      <button
        onClick={checkConnection}
        disabled={connectionStatus === 'testing'}
        style={{
          background: connectionStatus === 'testing' ? '#9ca3af' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          padding: '0.5rem 1rem',
          fontSize: '0.9rem',
          cursor: connectionStatus === 'testing' ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        {connectionStatus === 'testing' ? (
          <>
            <FontAwesomeIcon icon={faSpinner} spin />
            Testing...
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faServer} />
            {t('testConnection')}
          </>
        )}
      </button>
    </div>
  );
};

export default ConnectionTest;
