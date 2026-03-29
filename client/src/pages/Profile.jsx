import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { profileService } from '../services/firebase';
import { apiService } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faEnvelope, faCalendar, faEdit, faPhone, faMapMarkerAlt,
  faBirthdayCake, faVenusMars, faTint, faWeight, faRuler, faHeartbeat,
  faShieldAlt, faHistory, faCog, faSignOutAlt, faBell, faEye, faLock,
  faChartLine, faAward, faCamera, faSave, faTimes
} from '@fortawesome/free-solid-svg-icons';
import '../styles/profile.css';

const Profile = () => {
  const { currentUser, userProfile, signOut } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [settings, setSettings] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [rawValues, setRawValues] = useState({
    height: '',
    weight: '',
    heartRate: ''
  });

  // Create effective user for development or use current user
  const effectiveUser = currentUser || {
    uid: 'dev_user_123',
    email: 'dev@halo.com',
    displayName: 'Development User',
    photoURL: null,
    metadata: {
      creationTime: new Date().toISOString()
    }
  };

  // Show login prompt only in production if no current user
  if (!currentUser && import.meta.env.PROD) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="not-logged-in">
            <FontAwesomeIcon icon={faUser} className="login-icon" />
            <h2>Please log in to view your profile</h2>
            <p>Access your personal health dashboard by signing in</p>
          </div>
        </div>
      </div>
    );
  }

  // Load user data from server (with Firebase fallback)
  useEffect(() => {
    const loadUserData = async () => {
      if (!effectiveUser) return;
      
      setLoading(true);
      try {
        // Try server API first
        try {
          const userId = effectiveUser.uid;
          console.log('🔍 Loading profile for user:', userId);
          
          const serverResult = await apiService.profile.getCompleteProfile(userId);
          if (serverResult.data && serverResult.data.success) {
            const data = serverResult.data.data;
            setProfileData(data.profile || {});
            setHealthData(data.health || {});
            setActivities(data.activities || []);
            setSettings(data.settings || {});
            
            // Initialize edit form with server data
            setEditForm({
              name: data.profile?.name || effectiveUser.displayName || '',
              age: data.profile?.age || '',
              gender: data.profile?.gender || '',
              phone: data.profile?.phone || '',
              location: data.profile?.location || '',
              emergencyContact: data.profile?.emergencyContact || '',
              height: data.health?.height || '',
              weight: data.health?.weight || '',
              bloodType: data.health?.bloodType || '',
              heartRate: data.health?.heartRate || '',
              bloodPressure: data.health?.bloodPressure || '',
              allergies: data.health?.allergies || [],
              medications: data.health?.medications || []
            });
            
            // Initialize raw values for editing
            setRawValues({
              height: data.health?.height?.replace(/[^\d.]/g, '') || '',
              weight: data.health?.weight?.replace(/[^\d.]/g, '') || '',
              heartRate: data.health?.heartRate?.replace(/[^\d]/g, '') || ''
            });
            
            console.log('✅ Profile data loaded from server');
            return;
          }
        } catch (serverError) {
          console.warn('Server API error:', serverError.response?.data || serverError.message);
          console.log('🔄 Falling back to Firebase...');
        }
        
        // Fallback to Firebase (only if Firebase is configured)
        if (currentUser) {
          try {
            const result = await profileService.getUserProfile(currentUser.uid);
            if (result.success) {
              setProfileData(result.data.profile);
              setHealthData(result.data.health);
              setActivities(result.data.activities);
              setSettings(result.data.settings);
              
              // Initialize edit form with Firebase data
              setEditForm({
                name: result.data.profile?.name || currentUser.displayName || '',
                age: result.data.profile?.age || '',
                gender: result.data.profile?.gender || '',
                phone: result.data.profile?.phone || '',
                location: result.data.profile?.location || '',
                emergencyContact: result.data.profile?.emergencyContact || '',
                height: result.data.health?.height || '',
                weight: result.data.health?.weight || '',
                bloodType: result.data.health?.bloodType || '',
                heartRate: result.data.health?.heartRate || '',
                bloodPressure: result.data.health?.bloodPressure || '',
                allergies: result.data.health?.allergies || [],
                medications: result.data.health?.medications || []
              });
              
              // Initialize raw values for editing
              setRawValues({
                height: result.data.health?.height?.replace(/[^\d.]/g, '') || '',
                weight: result.data.health?.weight?.replace(/[^\d.]/g, '') || '',
                heartRate: result.data.health?.heartRate?.replace(/[^\d]/g, '') || ''
              });
              
              console.log('✅ Profile data loaded from Firebase');
            } else {
              console.warn('Firebase fallback failed, initializing empty data');
              initializeEmptyData();
            }
          } catch (firebaseError) {
            console.warn('Firebase not available, initializing empty data');
            initializeEmptyData();
          }
        } else {
          console.warn('No current user available');
          initializeEmptyData();
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        initializeEmptyData();
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [effectiveUser]);

  const initializeEmptyData = () => {
    const emptyProfile = {
      name: effectiveUser?.displayName || '',
      email: effectiveUser?.email || '',
      photoURL: effectiveUser?.photoURL || null,
      createdAt: effectiveUser?.metadata?.creationTime,
      age: null,
      gender: '',
      phone: '',
      location: '',
      emergencyContact: ''
    };
    
    const emptyHealth = {
      height: '',
      weight: '',
      bmi: '',
      bloodPressure: '',
      heartRate: '',
      bloodType: '',
      allergies: [],
      medications: []
    };

    const emptyActivities = [];

    const defaultSettings = {
      notifications: {
        healthReminders: false,
        appointmentAlerts: false,
        medicationReminders: false
      },
      privacy: {
        profileVisibility: 'private',
        dataSharing: false
      }
    };

    setProfileData(emptyProfile);
    setHealthData(emptyHealth);
    setActivities(emptyActivities);
    setSettings(defaultSettings);
    
    setEditForm({
      name: effectiveUser?.displayName || '',
      age: '',
      gender: '',
      phone: '',
      location: '',
      emergencyContact: '',
      height: '',
      weight: '',
      bloodType: '',
      heartRate: '',
      bloodPressure: '',
      allergies: [],
      medications: []
    });
    
    setRawValues({
      height: '',
      weight: '',
      heartRate: ''
    });
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleSaveProfile = async () => {
    if (!effectiveUser) return;
    
    setLoading(true);
    try {
      // Prepare profile update data
      const profileUpdate = {
        name: editForm.name,
        age: editForm.age,
        gender: editForm.gender,
        phone: editForm.phone,
        location: editForm.location,
        emergencyContact: editForm.emergencyContact,
        email: effectiveUser.email
      };

      // Prepare health update data
      const healthUpdate = {
        height: editForm.height,
        weight: editForm.weight,
        bloodType: editForm.bloodType,
        heartRate: editForm.heartRate || '72 bpm',
        bloodPressure: editForm.bloodPressure || '120/80',
        allergies: editForm.allergies,
        medications: editForm.medications,
        bmi: calculateBMI(editForm.height, editForm.weight)
      };

      let profileResult, healthResult;

      // Try server API first
      try {
        const userId = effectiveUser.uid;
        console.log('💾 Saving profile for user:', userId);
        
        const serverProfileResult = await apiService.profile.updatePersonalInfo(userId, profileUpdate);
        const serverHealthResult = await apiService.profile.updateHealthProfile(userId, healthUpdate);
        
        if (serverProfileResult.data?.success && serverHealthResult.data?.success) {
          // Reload data from server
          const reloadResult = await apiService.profile.getCompleteProfile(userId);
          if (reloadResult.data?.success) {
            const data = reloadResult.data.data;
            setProfileData(data.profile);
            setHealthData(data.health);
          }
          
          setIsEditing(false);
          alert('Profile updated successfully via server!');
          
          // Add activity record
          try {
            await apiService.profile.addActivity(effectiveUser.uid, {
              type: 'profile_update',
              title: 'Profile Information Updated',
              description: 'Personal and health information updated'
            });
          } catch (activityError) {
            console.warn('Failed to add activity record:', activityError);
          }
          
          return;
        }
      } catch (serverError) {
        console.warn('Server update failed, falling back to Firebase:', serverError.message);
      }

      // Fallback to Firebase (only if real user exists)
      if (currentUser) {
        try {
          profileResult = await profileService.saveUserProfile(currentUser.uid, profileUpdate);
          healthResult = await profileService.updateHealthProfile(currentUser.uid, healthUpdate);

          if (profileResult.success && healthResult.success) {
            // Reload data from Firebase
            const result = await profileService.getUserProfile(currentUser.uid);
            if (result.success) {
              setProfileData(result.data.profile);
              setHealthData(result.data.health);
            }
            
            setIsEditing(false);
            alert('Profile updated successfully via Firebase!');
            
            // Add activity record to Firebase
            try {
              await profileService.addActivity(currentUser.uid, {
                type: 'profile_update',
                title: 'Profile Information Updated',
                description: 'Personal and health information updated'
              });
            } catch (activityError) {
              console.warn('Failed to add activity record:', activityError);
            }
          } else {
            alert('Failed to update profile. Please try again.');
          }
        } catch (firebaseError) {
          console.warn('Firebase save failed:', firebaseError);
          throw new Error('Failed to update profile via Firebase');
        }
      } else {
        throw new Error('Failed to update profile via Firebase');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (category, setting, value) => {
    if (!effectiveUser) return;

    const updatedSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: value
      }
    };

    setSettings(updatedSettings);

    try {
      // Try server API first
      try {
        await apiService.profile.updateSettings(effectiveUser.uid, updatedSettings);
        console.log('✅ Settings updated via server');
      } catch (serverError) {
        console.warn('Server settings update failed, using Firebase:', serverError.message);
        if (currentUser) {
          await profileService.updateSettings(currentUser.uid, updatedSettings);
          console.log('✅ Settings updated via Firebase');
        }
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !effectiveUser) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File too large. Maximum size is 5MB.');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
      return;
    }

    try {
      setLoading(true);
      
      // Try server API first
      try {
        const serverResult = await apiService.profile.uploadProfilePicture(effectiveUser.uid, file);
        if (serverResult.data?.success) {
          // Update profile data with new photo URL
          setProfileData(prev => ({
            ...prev,
            photoURL: serverResult.data.photoURL
          }));
          alert('Profile picture updated successfully via server!');
          return;
        }
      } catch (serverError) {
        console.warn('Server upload failed, using Firebase:', serverError.message);
      }

      // Fallback to Firebase
      const result = await profileService.uploadProfilePicture(currentUser.uid, file);
      if (result.success) {
        // Update profile data with new photo URL
        setProfileData(prev => ({
          ...prev,
          photoURL: result.url
        }));
        alert('Profile picture updated successfully via Firebase!');
      } else {
        alert('Failed to upload profile picture');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture');
    } finally {
      setLoading(false);
    }
  };

  const calculateBMI = (height, weight) => {
    // Enhanced BMI calculation with better parsing
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

  const getBMICategory = (bmi) => {
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return { category: 'Underweight', color: '#3498db' };
    if (bmiValue < 25) return { category: 'Normal', color: '#27ae60' };
    if (bmiValue < 30) return { category: 'Overweight', color: '#f39c12' };
    return { category: 'Obese', color: '#e74c3c' };
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Recently';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 30) return `${diffInDays} days ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  };


  return (
    <div className="profile-container">
      <div className="profile-layout">
        {/* Profile Header */}
        <div className="profile-header-card">
          <div className="profile-cover">
            <div className="profile-avatar-container">
              <div className="profile-avatar">
                {(profileData?.photoURL || effectiveUser.photoURL) ? (
                  <img 
                    src={profileData?.photoURL || effectiveUser.photoURL} 
                    alt="Profile" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <FontAwesomeIcon 
                  icon={faUser} 
                  style={{ 
                    display: (profileData?.photoURL || effectiveUser.photoURL) ? 'none' : 'flex',
                    fontSize: '3rem',
                    color: '#667eea'
                  }} 
                />
                <label className="avatar-edit-btn" htmlFor="profile-picture-upload">
                  <FontAwesomeIcon icon={faCamera} />
                  <input 
                    id="profile-picture-upload"
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>
          </div>
          
          <div className="profile-info">
            <h1 className="profile-name">
              {profileData?.name || effectiveUser.displayName || 'User'}
            </h1>
            <p className="profile-email">
              <FontAwesomeIcon icon={faEnvelope} />
              {effectiveUser.email}
            </p>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">{activities.filter(a => a.type === 'consultation').length || 0}</span>
                <span className="stat-label">Consultations</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{healthData?.healthScore || 0}%</span>
                <span className="stat-label">Health Score</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{activities.filter(a => a.type === 'test').length || 0}</span>
                <span className="stat-label">Tests Done</span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button 
              className={`action-btn ${isEditing ? 'editing' : ''}`}
              onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
              disabled={loading}
            >
              <FontAwesomeIcon icon={isEditing ? faSave : faEdit} />
              {loading ? 'Saving...' : (isEditing ? 'Save' : 'Edit Profile')}
            </button>
            <button className="action-btn logout-btn" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <FontAwesomeIcon icon={faUser} />
            Personal Info
          </button>
          <button 
            className={`tab-btn ${activeTab === 'health' ? 'active' : ''}`}
            onClick={() => setActiveTab('health')}
          >
            <FontAwesomeIcon icon={faHeartbeat} />
            Health Data
          </button>
          <button 
            className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            <FontAwesomeIcon icon={faChartLine} />
            Activity
          </button>
          <button 
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FontAwesomeIcon icon={faCog} />
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="profile-content">
          {activeTab === 'personal' && (
            <div className="tab-content">
              <div className="info-grid">
                <div className="info-card">
                  <h3><FontAwesomeIcon icon={faUser} /> Basic Information</h3>
                  <div className="info-items">
                    <div className="info-item">
                      <FontAwesomeIcon icon={faCalendar} />
                      <span>Member since: {new Date(effectiveUser.metadata?.creationTime || Date.now()).toLocaleDateString()}</span>
                    </div>
                    
                    {/* Editable Name Field */}
                    <div className="info-item">
                      <FontAwesomeIcon icon={faUser} />
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          placeholder="Full Name"
                          className="edit-input"
                        />
                      ) : (
                        <span>Name: {profileData?.name || editForm.name || ''}</span>
                      )}
                    </div>
                    
                    {/* Editable Age Field */}
                    <div className="info-item">
                      <FontAwesomeIcon icon={faBirthdayCake} />
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.age}
                          onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                          placeholder="Age"
                          min="18"
                          max="100"
                          className="edit-input"
                        />
                      ) : (
                        <span>Age: {profileData?.age || editForm.age || ''} {(profileData?.age || editForm.age) ? 'years' : ''}</span>
                      )}
                    </div>
                    
                    {/* Editable Gender Field */}
                    <div className="info-item">
                      <FontAwesomeIcon icon={faVenusMars} />
                      {isEditing ? (
                        <select
                          value={editForm.gender}
                          onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                          className="edit-input"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      ) : (
                        <span>Gender: {profileData?.gender || editForm.gender || ''}</span>
                      )}
                    </div>
                    
                    {/* Editable Phone Field */}
                    <div className="info-item">
                      <FontAwesomeIcon icon={faPhone} />
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                          placeholder="Phone Number"
                          className="edit-input"
                        />
                      ) : (
                        <span>Phone: {profileData?.phone || editForm.phone || ''}</span>
                      )}
                    </div>
                    
                    {/* Editable Location Field */}
                    <div className="info-item">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.location}
                          onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                          placeholder="Location"
                          className="edit-input"
                        />
                      ) : (
                        <span>Location: {profileData?.location || editForm.location || ''}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <h3><FontAwesomeIcon icon={faShieldAlt} /> Emergency Contact</h3>
                  <div className="info-items">
                    {/* Editable Emergency Contact Field */}
                    <div className="info-item">
                      <FontAwesomeIcon icon={faUser} />
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.emergencyContact}
                          onChange={(e) => setEditForm({...editForm, emergencyContact: e.target.value})}
                          placeholder="Emergency Contact Name"
                          className="edit-input"
                        />
                      ) : (
                        <span>Contact: {profileData?.emergencyContact || editForm.emergencyContact || ''}</span>
                      )}
                    </div>
                    <div className="info-item">
                      <FontAwesomeIcon icon={faPhone} />
                      <span>Phone: {profileData?.emergencyPhone || ''}</span>
                    </div>
                    <div className="info-item">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      <span>Location: {profileData?.emergencyLocation || ''}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'health' && (
            <div className="tab-content">
              <div className="health-grid">
                {/* Physical Stats Card */}
                <div className="health-card enhanced">
                  <div className="card-header">
                    <h3><FontAwesomeIcon icon={faRuler} /> Physical Measurements</h3>
                    <div className="health-score">
                      <span className="score-label">Health Score</span>
                      <span className="score-value">{healthData?.healthScore || '85'}%</span>
                    </div>
                  </div>
                  <div className="health-stats-grid">
                    {/* Height */}
                    <div className="stat-card">
                      <div className="stat-icon">
                        <FontAwesomeIcon icon={faRuler} />
                      </div>
                      <div className="stat-content">
                        <span className="stat-label">Height</span>
                        {isEditing ? (
                          <div className="input-group">
                            <input
                              type="number"
                              value={rawValues.height}
                              onChange={(e) => {
                                const value = e.target.value;
                                setRawValues({...rawValues, height: value});
                                setEditForm({...editForm, height: value ? value + ' cm' : ''});
                              }}
                              placeholder="170"
                              className="stat-input"
                            />
                            <span className="input-unit">cm</span>
                          </div>
                        ) : (
                          <span className="stat-value">{healthData?.height || editForm.height || 'Not set'}</span>
                        )}
                        <div className="stat-info">
                          <small>Average: 165-175 cm</small>
                        </div>
                      </div>
                    </div>

                    {/* Weight */}
                    <div className="stat-card">
                      <div className="stat-icon">
                        <FontAwesomeIcon icon={faWeight} />
                      </div>
                      <div className="stat-content">
                        <span className="stat-label">Weight</span>
                        {isEditing ? (
                          <div className="input-group">
                            <input
                              type="number"
                              value={rawValues.weight}
                              onChange={(e) => {
                                const value = e.target.value;
                                setRawValues({...rawValues, weight: value});
                                setEditForm({...editForm, weight: value ? value + ' kg' : ''});
                              }}
                              placeholder="70"
                              className="stat-input"
                            />
                            <span className="input-unit">kg</span>
                          </div>
                        ) : (
                          <span className="stat-value">{healthData?.weight || editForm.weight || 'Not set'}</span>
                        )}
                        <div className="stat-info">
                          <small>Healthy range: 55-85 kg</small>
                        </div>
                      </div>
                    </div>

                    {/* BMI */}
                    <div className="stat-card bmi-card">
                      <div className="stat-icon">
                        <FontAwesomeIcon icon={faChartLine} />
                      </div>
                      <div className="stat-content">
                        <span className="stat-label">BMI</span>
                        <span className="stat-value bmi-value">
                          {healthData?.bmi || calculateBMI(rawValues.height ? rawValues.height + ' cm' : editForm.height, rawValues.weight ? rawValues.weight + ' kg' : editForm.weight) || 'Calculate'}
                        </span>
                        <div className="bmi-indicator">
                          {(() => {
                            const bmi = parseFloat(healthData?.bmi || calculateBMI(rawValues.height ? rawValues.height + ' cm' : editForm.height, rawValues.weight ? rawValues.weight + ' kg' : editForm.weight));
                            if (bmi < 18.5) return <span className="bmi-status underweight">Underweight</span>;
                            if (bmi < 25) return <span className="bmi-status normal">Normal</span>;
                            if (bmi < 30) return <span className="bmi-status overweight">Overweight</span>;
                            if (bmi >= 30) return <span className="bmi-status obese">Obese</span>;
                            return <small>Enter height & weight</small>;
                          })()} 
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vital Signs Card */}
                <div className="health-card enhanced">
                  <div className="card-header">
                    <h3><FontAwesomeIcon icon={faHeartbeat} /> Vital Signs & Blood Info</h3>
                    <div className="last-updated">
                      <small>Last updated: {new Date().toLocaleDateString()}</small>
                    </div>
                  </div>
                  <div className="health-stats-grid">
                    {/* Heart Rate */}
                    <div className="stat-card">
                      <div className="stat-icon pulse">
                        <FontAwesomeIcon icon={faHeartbeat} />
                      </div>
                      <div className="stat-content">
                        <span className="stat-label">Heart Rate</span>
                        {isEditing ? (
                          <div className="input-group">
                            <input
                              type="number"
                              value={rawValues.heartRate}
                              onChange={(e) => {
                                const value = e.target.value;
                                setRawValues({...rawValues, heartRate: value});
                                setEditForm({...editForm, heartRate: value ? value + ' bpm' : ''});
                              }}
                              placeholder="72"
                              className="stat-input"
                            />
                            <span className="input-unit">bpm</span>
                          </div>
                        ) : (
                          <span className="stat-value">{healthData?.heartRate || editForm.heartRate || '72 bpm'}</span>
                        )}
                        <div className="stat-info">
                          <small>Normal: 60-100 bpm</small>
                        </div>
                      </div>
                    </div>

                    {/* Blood Pressure */}
                    <div className="stat-card">
                      <div className="stat-icon">
                        <FontAwesomeIcon icon={faTint} />
                      </div>
                      <div className="stat-content">
                        <span className="stat-label">Blood Pressure</span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.bloodPressure || ''}
                            onChange={(e) => setEditForm({...editForm, bloodPressure: e.target.value})}
                            placeholder="120/80"
                            className="stat-input"
                          />
                        ) : (
                          <span className="stat-value">{healthData?.bloodPressure || editForm.bloodPressure || '120/80'}</span>
                        )}
                        <div className="stat-info">
                          <small>Normal: &lt;120/80 mmHg</small>
                        </div>
                      </div>
                    </div>

                    {/* Blood Type */}
                    <div className="stat-card">
                      <div className="stat-icon">
                        <FontAwesomeIcon icon={faTint} />
                      </div>
                      <div className="stat-content">
                        <span className="stat-label">Blood Type</span>
                        {isEditing ? (
                          <select
                            value={editForm.bloodType}
                            onChange={(e) => setEditForm({...editForm, bloodType: e.target.value})}
                            className="stat-select"
                          >
                            <option value="">Select Type</option>
                            <option value="A+">A+ (34%)</option>
                            <option value="A-">A- (6%)</option>
                            <option value="B+">B+ (9%)</option>
                            <option value="B-">B- (2%)</option>
                            <option value="AB+">AB+ (3%)</option>
                            <option value="AB-">AB- (1%)</option>
                            <option value="O+">O+ (38%)</option>
                            <option value="O-">O- (7%)</option>
                          </select>
                        ) : (
                          <span className="stat-value blood-type">{healthData?.bloodType || editForm.bloodType || 'Not set'}</span>
                        )}
                        <div className="stat-info">
                          <small>Universal donor: O-</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical Information Card */}
                <div className="health-card enhanced full-width">
                  <div className="card-header">
                    <h3><FontAwesomeIcon icon={faShieldAlt} /> Medical Information</h3>
                    <div className="emergency-badge">
                      <FontAwesomeIcon icon={faShieldAlt} />
                      <span>Critical Info</span>
                    </div>
                  </div>
                  <div className="medical-grid">
                    {/* Allergies */}
                    <div className="medical-card">
                      <div className="medical-header">
                        <FontAwesomeIcon icon={faShieldAlt} className="medical-icon allergies" />
                        <h4>Allergies & Reactions</h4>
                      </div>
                      <div className="medical-content">
                        {isEditing ? (
                          <div className="tag-input-container">
                            <textarea
                              value={Array.isArray(editForm.allergies) ? editForm.allergies.join(', ') : editForm.allergies}
                              onChange={(e) => setEditForm({...editForm, allergies: e.target.value.split(', ').filter(a => a.trim())})}
                              placeholder="e.g., Peanuts, Shellfish, Penicillin"
                              className="medical-textarea"
                              rows="3"
                            />
                            <small className="input-help">Separate multiple allergies with commas</small>
                          </div>
                        ) : (
                          <div className="tags-display">
                            {(Array.isArray(healthData?.allergies) ? healthData.allergies : 
                              Array.isArray(editForm.allergies) ? editForm.allergies : []).length > 0 ? (
                              (Array.isArray(healthData?.allergies) ? healthData.allergies : editForm.allergies).map((allergy, index) => (
                                <span key={index} className="medical-tag allergy-tag">
                                  <FontAwesomeIcon icon={faShieldAlt} />
                                  {allergy}
                                </span>
                              ))
                            ) : (
                              <p className="no-data">No known allergies</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Medications */}
                    <div className="medical-card">
                      <div className="medical-header">
                        <FontAwesomeIcon icon={faHeartbeat} className="medical-icon medications" />
                        <h4>Current Medications</h4>
                      </div>
                      <div className="medical-content">
                        {isEditing ? (
                          <div className="tag-input-container">
                            <textarea
                              value={Array.isArray(editForm.medications) ? editForm.medications.join(', ') : editForm.medications}
                              onChange={(e) => setEditForm({...editForm, medications: e.target.value.split(', ').filter(m => m.trim())})}
                              placeholder="e.g., Aspirin 100mg daily, Vitamin D"
                              className="medical-textarea"
                              rows="3"
                            />
                            <small className="input-help">Include dosage and frequency if known</small>
                          </div>
                        ) : (
                          <div className="tags-display">
                            {(Array.isArray(healthData?.medications) ? healthData.medications : 
                              Array.isArray(editForm.medications) ? editForm.medications : []).length > 0 ? (
                              (Array.isArray(healthData?.medications) ? healthData.medications : editForm.medications).map((medication, index) => (
                                <span key={index} className="medical-tag medication-tag">
                                  <FontAwesomeIcon icon={faHeartbeat} />
                                  {medication}
                                </span>
                              ))
                            ) : (
                              <p className="no-data">No current medications</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="health-card full-width">
                  <h3><FontAwesomeIcon icon={faHistory} /> Medical History</h3>
                  <div className="medical-timeline">
                    {activities && activities.length > 0 ? (
                      activities.slice(0, 5).map((activity, index) => (
                        <div key={activity.id || index} className="timeline-item">
                          <div className="timeline-dot"></div>
                          <div className="timeline-content">
                            <h4>{activity.title || 'Medical Activity'}</h4>
                            <p>{activity.description || 'No description available'}</p>
                            <span className="timeline-date">{formatTimeAgo(activity.timestamp)}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="timeline-item">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                          <h4>No Medical History</h4>
                          <p>No medical records found. Start by adding your first health activity.</p>
                          <span className="timeline-date">-</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="tab-content">
              <div className="activity-grid">
                <div className="activity-card">
                  <h3><FontAwesomeIcon icon={faAward} /> Achievements</h3>
                  <div className="achievements">
                    <div className="achievement-item">
                      <FontAwesomeIcon icon={faHeartbeat} className="achievement-icon health" />
                      <span>Health Champion</span>
                    </div>
                    <div className="achievement-item">
                      <FontAwesomeIcon icon={faCalendar} className="achievement-icon consistency" />
                      <span>Regular Checkups</span>
                    </div>
                    <div className="achievement-item">
                      <FontAwesomeIcon icon={faChartLine} className="achievement-icon progress" />
                      <span>Health Improver</span>
                    </div>
                  </div>
                </div>

                <div className="activity-card">
                  <h3><FontAwesomeIcon icon={faChartLine} /> Recent Activity</h3>
                  <div className="activity-list">
                    {activities && activities.length > 0 ? (
                      activities.slice(0, 5).map((activity, index) => (
                        <div key={activity.id || index} className="activity-item">
                          <FontAwesomeIcon icon={
                            activity.type === 'health_assessment' ? faHeartbeat :
                            activity.type === 'consultation' ? faUser :
                            activity.type === 'test' ? faChartLine :
                            faHeartbeat
                          } />
                          <div className="activity-details">
                            <span className="activity-title">{activity.title || 'Activity'}</span>
                            <span className="activity-time">{formatTimeAgo(activity.timestamp)}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="activity-item">
                        <FontAwesomeIcon icon={faHeartbeat} />
                        <div className="activity-details">
                          <span className="activity-title">No recent activities</span>
                          <span className="activity-time">Start using HALO to see your activities here</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="tab-content">
              <div className="settings-grid">
                <div className="settings-card">
                  <h3><FontAwesomeIcon icon={faBell} /> Notifications</h3>
                  <div className="settings-items">
                    <div className="setting-item">
                      <span>Health Reminders</span>
                      <label className="toggle">
                        <input 
                          type="checkbox" 
                          checked={settings?.notifications?.healthReminders || false}
                          onChange={(e) => handleSettingChange('notifications', 'healthReminders', e.target.checked)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="setting-item">
                      <span>Appointment Alerts</span>
                      <label className="toggle">
                        <input 
                          type="checkbox" 
                          checked={settings?.notifications?.appointmentAlerts || false}
                          onChange={(e) => handleSettingChange('notifications', 'appointmentAlerts', e.target.checked)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="setting-item">
                      <span>Medication Reminders</span>
                      <label className="toggle">
                        <input 
                          type="checkbox" 
                          checked={settings?.notifications?.medicationReminders || false}
                          onChange={(e) => handleSettingChange('notifications', 'medicationReminders', e.target.checked)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="settings-card">
                  <h3><FontAwesomeIcon icon={faLock} /> Privacy</h3>
                  <div className="settings-items">
                    <div className="setting-item">
                      <span>Profile Visibility</span>
                      <select 
                        className="setting-select"
                        value={settings?.privacy?.profileVisibility || 'private'}
                        onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                      >
                        <option value="private">Private</option>
                        <option value="public">Public</option>
                        <option value="friends">Friends Only</option>
                      </select>
                    </div>
                    <div className="setting-item">
                      <span>Data Sharing</span>
                      <label className="toggle">
                        <input 
                          type="checkbox" 
                          checked={settings?.privacy?.dataSharing || false}
                          onChange={(e) => handleSettingChange('privacy', 'dataSharing', e.target.checked)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
