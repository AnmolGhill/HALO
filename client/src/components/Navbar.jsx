import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartbeat, faUser, faSignOutAlt, faGlobe, faChevronDown, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { currentUser, userProfile, signOut, loading } = useAuth();
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
    { code: 'or', name: 'Odia (ଓଡ଼ିଆ)', flag: '🇮🇳' }
  ];

  const handleLogout = async () => {
    try {
      console.log('🚪 Initiating logout...');
      const result = await signOut();
      if (result.success) {
        console.log('✅ Logout successful, redirecting...');
        // Clear any remaining data and force page reload
        localStorage.clear();
        sessionStorage.clear();
        navigate('/');
        // Force a page reload to ensure complete cleanup
        window.location.reload();
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local data and redirect
      localStorage.clear();
      sessionStorage.clear();
      navigate('/');
      window.location.reload();
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleWhatsAppClick = () => {
    // Replace with your actual WhatsApp bot link
    const whatsappLink = "https://wa.me/1234567890?text=Hello%20HALO!%20I%20need%20health%20assistance.";
    window.open(whatsappLink, '_blank');
  };

  const handleProfileClick = () => {
    // Navigate to user profile page or show profile dropdown
    navigate('/profile'); // You can create a profile page later
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageOpen(!isLanguageOpen);
  };

  const handleLanguageSelect = (language) => {
    changeLanguage(language.code);
    setIsLanguageOpen(false);
    console.log('Language changed to:', language.code);
  };

  const getCurrentLanguageName = () => {
    const lang = languages.find(l => l.code === currentLanguage);
    return lang ? lang.name : 'English';
  };

  return (
    <nav className="nav-bar">
      {/* Left Side: HALO Logo and Title */}
      <div className="nav-brand">
        <h1>
          <FontAwesomeIcon icon={faHeartbeat} /> HALO
        </h1>
      </div>

      {/* WhatsApp Logo */}
      <div className="whatsapp-logo" onClick={handleWhatsAppClick}>
        <FontAwesomeIcon icon={faWhatsapp} />
      </div>

      {/* Profile Logo - Only shown when user is logged in */}
      {currentUser && (
        <div className="profile-logo" onClick={handleProfileClick}>
          <FontAwesomeIcon icon={faUserCircle} />
        </div>
      )}

      {/* Language Selector */}
      <div className="language-selector">
        <button className="language-btn" onClick={toggleLanguageDropdown}>
          <FontAwesomeIcon icon={faGlobe} />
          <span className="language-text">{getCurrentLanguageName()}</span>
          <FontAwesomeIcon icon={faChevronDown} className={`chevron ${isLanguageOpen ? 'open' : ''}`} />
        </button>
        
        {isLanguageOpen && (
          <div className="language-dropdown">
            {languages.map((language) => (
              <div
                key={language.code}
                className={`language-option ${currentLanguage === language.code ? 'selected' : ''}`}
                onClick={() => handleLanguageSelect(language)}
              >
                <span className="flag">{language.flag}</span>
                <span className="language-name">{language.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Side: Navigation Buttons */}
      <div className="nav-right">
        {/* Mobile menu icon */}
        <div className="menu-toggle" onClick={toggleMenu}>
          <span className="menu-icon">&#9776;</span>
          {currentUser && (
            <FontAwesomeIcon icon={faUserCircle} className="profile-icon-in-toggle" />
          )}
        </div>

        {/* Buttons */}
        <div className={`nav-buttons ${isMenuOpen ? 'active' : ''}`}>
          {/* About button */}
          <Link to="/about" className="btn-primary">
            {t('about')}
          </Link>

          {!currentUser ? (
            <>
              {/* Login button */}
              <Link to="/login" className="btn-primary">
                {t('login')}
              </Link>

              {/* Register button */}
              <Link to="/register" className="btn-primary">
                {t('register')}
              </Link>
            </>
          ) : (
            <>
              {/* User name display */}
              {userProfile && (
                <span className="user-greeting" style={{ 
                  color: '#10b981', 
                  fontWeight: '500',
                  marginRight: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <FontAwesomeIcon icon={faUser} />
                  {userProfile.name || currentUser.displayName || 'User'}
                </span>
              )}

              {/* Logout button */}
              <button 
                className="btn-primary" 
                onClick={handleLogout}
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                {loading ? 'Signing out...' : t('logout')}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
