import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserMd, 
  faUser, 
  faWeight, 
  faNotesMedical, 
  faPhoneAlt,
  faEnvelope,
  faCalendar,
  faRulerVertical,
  faUsers,
  faPhone,
  faArrowLeft,
  faSave
} from '@fortawesome/free-solid-svg-icons';
import '../styles/health.css';

const Health = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    gender: '',
    weight: '',
    height: '',
    bloodType: '',
    conditions: '',
    medications: '',
    allergies: '',
    emergencyName: '',
    emergencyRelation: '',
    emergencyPhone: ''
  });

  useEffect(() => {
    // Load existing health data if available
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.userId) {
      // In a real app, you would fetch this from the API
      // For now, we'll check localStorage for saved health data
      const savedHealthData = localStorage.getItem('healthProfile');
      if (savedHealthData) {
        setFormData(JSON.parse(savedHealthData));
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // In a real app, you would send this to your API
      // For now, we'll save to localStorage
      localStorage.setItem('healthProfile', JSON.stringify(formData));
      
      // Show success message (you can implement a toast notification)
      alert('Health profile saved successfully!');
      
      // Navigate back to home
      navigate('/');
    } catch (error) {
      console.error('Error saving health profile:', error);
      alert('Failed to save health profile. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="health-form-container">
      <div className="form-header">
        <h1>
          <FontAwesomeIcon icon={faUserMd} /> Your Health Profile
        </h1>
        <p>Keep your health information up to date</p>
        <div className="form-progress">
          <div className="progress-step active completed">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div className="progress-step active">
            <FontAwesomeIcon icon={faWeight} />
          </div>
          <div className="progress-step">
            <FontAwesomeIcon icon={faNotesMedical} />
          </div>
          <div className="progress-step">
            <FontAwesomeIcon icon={faPhoneAlt} />
          </div>
        </div>
      </div>

      <div className="form-content">
        <form onSubmit={handleSubmit} className="health-form">
          {/* Personal Information */}
          <div className="form-section">
            <h2>
              <FontAwesomeIcon icon={faUser} /> Personal Information
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-icon">
                  <FontAwesomeIcon icon={faUser} />
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-icon">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="dob">Date of Birth</label>
                <div className="input-icon">
                  <FontAwesomeIcon icon={faCalendar} />
                  <input 
                    type="date" 
                    id="dob" 
                    name="dob" 
                    value={formData.dob}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select 
                  id="gender" 
                  name="gender" 
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Physical Measurements */}
          <div className="form-section">
            <h2>
              <FontAwesomeIcon icon={faWeight} /> Physical Measurements
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <div className="input-icon">
                  <FontAwesomeIcon icon={faWeight} />
                  <input 
                    type="number" 
                    id="weight" 
                    name="weight" 
                    step="0.1" 
                    value={formData.weight}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="height">Height (cm)</label>
                <div className="input-icon">
                  <FontAwesomeIcon icon={faRulerVertical} />
                  <input 
                    type="number" 
                    id="height" 
                    name="height" 
                    value={formData.height}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="bloodType">Blood Type</label>
                <select 
                  id="bloodType" 
                  name="bloodType" 
                  value={formData.bloodType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="form-section">
            <h2>
              <FontAwesomeIcon icon={faNotesMedical} /> Medical Information
            </h2>
            <div className="form-group">
              <label htmlFor="conditions">Medical Conditions</label>
              <textarea 
                id="conditions" 
                name="conditions" 
                rows="3" 
                placeholder="List any medical conditions..."
                value={formData.conditions}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="medications">Current Medications</label>
              <textarea 
                id="medications" 
                name="medications" 
                rows="3" 
                placeholder="List any medications you're currently taking..."
                value={formData.medications}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="allergies">Allergies</label>
              <textarea 
                id="allergies" 
                name="allergies" 
                rows="3" 
                placeholder="List any allergies..."
                value={formData.allergies}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="form-section">
            <h2>
              <FontAwesomeIcon icon={faPhoneAlt} /> Emergency Contact
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="emergencyName">Contact Name</label>
                <div className="input-icon">
                  <FontAwesomeIcon icon={faUser} />
                  <input 
                    type="text" 
                    id="emergencyName" 
                    name="emergencyName" 
                    value={formData.emergencyName}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="emergencyRelation">Relationship</label>
                <div className="input-icon">
                  <FontAwesomeIcon icon={faUsers} />
                  <input 
                    type="text" 
                    id="emergencyRelation" 
                    name="emergencyRelation" 
                    value={formData.emergencyRelation}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="emergencyPhone">Phone Number</label>
                <div className="input-icon">
                  <FontAwesomeIcon icon={faPhone} />
                  <input 
                    type="tel" 
                    id="emergencyPhone" 
                    name="emergencyPhone" 
                    value={formData.emergencyPhone}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              <FontAwesomeIcon icon={faArrowLeft} /> Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <FontAwesomeIcon icon={faSave} /> Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Health;
