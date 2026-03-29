import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faUserMd, faPills, faBrain } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useLanguage } from '../contexts/LanguageContext';

const Sidebar = () => {
  const { t } = useLanguage();
  
  return (
    <div className="sidebar">
      <div className="sidebar-services">
        
        {/* 1. Healthcare Chatbot */}
        <Link to="/chatbot" className="service-btn chatbot-btn">
          <span className="icon">
            <FontAwesomeIcon icon={faRobot} />
          </span>
          <div className="service-content">
            <h3>{t('healthcareBot')}</h3>
            <p>{t('healthcareBotDesc')}</p>
          </div>
        </Link>

        {/* 2. Doctor Preference (Online) */}
        <Link to="/doctor" className="service-btn doctor-btn">
          <span className="icon">
            <FontAwesomeIcon icon={faUserMd} />
          </span>
          <div className="service-content">
            <h3>{t('doctorPreference')}</h3>
            <p>{t('doctorPreferenceDesc')}</p>
          </div>
        </Link>

        {/* 3. Medicine Recognition */}
        <Link to="/medicine" className="service-btn medicine-btn">
          <span className="icon">
            <FontAwesomeIcon icon={faPills} />
          </span>
          <div className="service-content">
            <h3>{t('medicineRecognition')}</h3>
            <p>{t('medicineRecognitionDesc')}</p>
          </div>
        </Link>

        {/* 4. EQ Assessment */}
        <Link to="/eqtest" className="service-btn eq-btn">
          <span className="icon">
            <FontAwesomeIcon icon={faBrain} />
          </span>
          <div className="service-content">
            <h3>{t('eqAssessment')}</h3>
            <p>{t('eqAssessmentDesc')}</p>
          </div>
        </Link>

        {/* 5. WhatsApp Services */}
        <div 
          className="service-btn whatsapp-btn" 
          onClick={() => window.open("https://wa.me/1234567890?text=Hello%20HALO!%20I%20need%20health%20assistance.", '_blank')}
          style={{ cursor: 'pointer' }}
        >
          <span className="icon">
            <FontAwesomeIcon icon={faWhatsapp} />
          </span>
          <div className="service-content">
            <h3>{t('whatsappServices')}</h3>
            <p>{t('whatsappServicesDesc')}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Sidebar;
