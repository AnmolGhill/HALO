import React, { useState, useEffect, useMemo, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeartbeat, 
  faWeight, 
  faRulerVertical, 
  faTint, 
  faHistory, 
  faChartLine,
  faRobot,
  faPills,
  faBrain
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import Sidebar from '../components/Sidebar';
import GoogleMapWidget from '../components/GoogleMapWidget';
import ConnectionTest from '../components/ConnectionTest';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

const Home = () => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const [healthData, setHealthData] = useState({
    weight: 'Loading...',
    height: 'Loading...',
    bloodType: 'Loading...',
    bmi: 'Loading...'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isLoadingRef = useRef(false);

  // Create effective user for development or use current user (memoized to prevent infinite loops)
  const effectiveUser = useMemo(() => {
    return currentUser || {
      uid: 'dev_user_123',
      email: 'dev@halo.com',
      displayName: 'Development User'
    };
  }, [currentUser]);

  // Calculate BMI from height and weight
  const calculateBMI = (height, weight) => {
    if (!height || !weight) return '';
    
    // Parse height (assume cm if just number, convert from feet if contains ')
    let heightInM;
    const heightNum = parseFloat(height.replace(/[^\d.]/g, ''));
    if (height.includes("'") || height.includes('ft')) {
      heightInM = heightNum * 0.3048; // Convert feet to meters
    } else {
      heightInM = heightNum / 100; // Convert cm to meters
    }
    
    const weightInKg = parseFloat(weight.replace(/[^\d.]/g, ''));
    
    if (heightInM && weightInKg && heightInM > 0 && weightInKg > 0) {
      return (weightInKg / (heightInM * heightInM)).toFixed(1);
    }
    return '';
  };

  useEffect(() => {
    const loadUserHealthData = async () => {
      if (!effectiveUser || !effectiveUser.uid || isLoadingRef.current) return;
      
      isLoadingRef.current = true;
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔍 Loading health data for user:', effectiveUser.uid);
        
        // Fetch complete profile data from API
        const response = await apiService.profile.getCompleteProfile(effectiveUser.uid);
        
        if (response.data && response.data.success) {
          const profileData = response.data.data;
          const health = profileData.health || {};
          
          // Calculate BMI if height and weight are available
          const bmi = calculateBMI(health.height, health.weight);
          
          setHealthData({
            weight: health.weight || 'Not set',
            height: health.height || 'Not set',
            bloodType: health.bloodType || 'Not set',
            bmi: bmi || 'Not available'
          });
          
          console.log('✅ Health data loaded successfully:', health);
        } else {
          throw new Error('Failed to fetch profile data');
        }
      } catch (apiError) {
        console.warn('API error, using fallback data:', apiError.message);
        setError('Unable to load health data');
        
        // Fallback to mock data if API fails
        setHealthData({
          weight: '70 kg',
          height: '175 cm',
          bloodType: 'O+',
          bmi: '22.9'
        });
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    };

    loadUserHealthData();
  }, [effectiveUser.uid]);

  return (
    <div className="main-container">
      <Sidebar />

      <div className="content">
        {/* Connection Test */}
        <ConnectionTest />

        {/* Error Display */}
        {error && (
          <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            color: '#856404',
            padding: '12px',
            borderRadius: '8px',
            margin: '20px 0',
            textAlign: 'center'
          }}>
            <FontAwesomeIcon icon={faHeartbeat} style={{ marginRight: '8px' }} />
            {error} - Using fallback data for demonstration
          </div>
        )}

        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-banner">
            <div className="hero-content">
              <div className="hero-text">
                {/* Title */}
                <h2>
                  <FontAwesomeIcon icon={faHeartbeat} /> {t('heroTitle')}
                </h2>
                
                {/* Google Map (responsive) */}
                <div style={{ margin: '0 auto', width: '100%', maxWidth: '720px' }}>
                  <GoogleMapWidget />
                </div>

                {/* Description */}
                <p>{t('heroDesc')}</p>
              </div>
            </div>
          </div>
        </div>
         
        {/* Your Health Overview */}
        <div className="health-info">
          <div className="health-header">
            <h2>
              <FontAwesomeIcon icon={faHeartbeat} /> {t('healthOverview')}
            </h2>
            <div className="health-status"></div>
          </div>
          
          <div className="health-dashboard">
            {/* Main Health Status */}
            <div className="whb-container">
              {/* 1. Weight */}
              <div className="health-stat-card primary">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faWeight} />
                </div>
                <div className="stat-content">
                  <h4>{t('weight')}</h4>
                  <p className="stat-value">{healthData.weight}</p>
                  <div className="stat-trend positive"></div>
                </div>
              </div>

              {/* 2. Height */}
              <div className="health-stat-card">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faRulerVertical} />
                </div>
                <div className="stat-content">
                  <h4>{t('height')}</h4>
                  <p className="stat-value">{healthData.height}</p>
                  <div className="stat-trend neutral"></div>
                </div>
              </div>

              {/* 3. Blood Type */}
              <div className="health-stat-card">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faTint} />
                </div>
                <div className="stat-content">
                  <h4>{t('bloodType')}</h4>
                  <p className="stat-value">{healthData.bloodType}</p>
                  <div className="stat-info"></div>
                </div>
              </div>
            </div>

            {/* Recent Medical History section */}
            <div className="recent-medical-history-card">
              {/* Section Heading */}
              <h3>
                <FontAwesomeIcon icon={faHistory} /> {t('recentHistory')}
              </h3>

              {/* Timeline container */}
              <div className="medical-history-timeline">
                {/* 1. Event: Last Checkup */}
                <div className="medical-history-event">
                  <div className="event-dot"></div>
                  <div className="event-details">
                    <h4>{t('lastCheckup')}</h4>
                    <p>{t('regularCheckup')}</p>
                    <span className="event-date">2 {t('weeksAgo')}</span>
                  </div>
                </div>

                {/* 2. Event: Vaccination */}
                <div className="medical-history-event">
                  <div className="event-dot"></div>
                  <div className="event-details">
                    <h4>{t('vaccination')}</h4>
                    <p>{t('fluShot')}</p>
                    <span className="event-date">1 {t('monthAgo')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Metrics Chart */}
            <div className="health-metrics">
              {/* Section Heading */}
              <h3>
                <FontAwesomeIcon icon={faChartLine} /> {t('healthMetrics')}
              </h3>

              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-header">
                    <h4>BMI</h4>
                    <span className="metric-value">
                      {loading ? 'Loading...' : (healthData.bmi !== 'Not available' ? healthData.bmi : 'N/A')}
                    </span>
                  </div>
                  <div className="metric-indicator">
                    <div className="indicator-bar" style={{ 
                      width: healthData.bmi !== 'Not available' && !loading ? 
                        `${Math.min((parseFloat(healthData.bmi) / 30) * 100, 100)}%` : '0%' 
                    }}></div>
                  </div>
                  <span className="metric-status">
                    {loading ? 'Loading...' : (() => {
                      const bmi = parseFloat(healthData.bmi);
                      if (isNaN(bmi)) return 'Not available';
                      if (bmi < 18.5) return 'Underweight';
                      if (bmi < 25) return t('normal');
                      if (bmi < 30) return 'Overweight';
                      return 'Obese';
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Descriptions */}
        <div className="service-descriptions">
          {/* Healthcare Chatbot Description */}
          <div className="service-description">
            <h3>
              <FontAwesomeIcon icon={faRobot} /> {t('healthcareBot')}
            </h3>
            <p>
              {t('healthcareBotLongDesc')}
            </p>
          </div>
        
          {/* Medicine Recognition Description */}
          <div className="service-description">
            <h3>
              <FontAwesomeIcon icon={faPills} /> {t('medicineRecognition')}
            </h3>
            <p>
              {t('medicineRecognitionLongDesc')}
            </p>
          </div>
        
          {/* EQ Assessment Description */}
          <div className="service-description">
            <h3>
              <FontAwesomeIcon icon={faBrain} /> {t('eqAssessment')}
            </h3>
            <p>
              {t('eqAssessmentLongDesc')}
            </p>
          </div>

          {/* WhatsApp Services Description */}
          <div className="service-description">
            <h3>
              <FontAwesomeIcon icon={faWhatsapp} /> {t('whatsappServices')}
            </h3>
            <p>
              {t('whatsappServicesLongDesc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;