import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd, faStar, faPhone, faVideo, faCalendar } from '@fortawesome/free-solid-svg-icons';

const Doctor = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'General Medicine',
      rating: 4.8,
      experience: '10 years',
      availability: 'Available Now',
      consultationFee: '$50',
      image: '/api/placeholder/150/150'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      rating: 4.9,
      experience: '15 years',
      availability: 'Available in 30 mins',
      consultationFee: '$75',
      image: '/api/placeholder/150/150'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Pediatrics',
      rating: 4.7,
      experience: '8 years',
      availability: 'Available Tomorrow',
      consultationFee: '$60',
      image: '/api/placeholder/150/150'
    }
  ];

  const handleBookConsultation = (doctor) => {
    setSelectedDoctor(doctor);
    alert(`Booking consultation with ${doctor.name}. You will be redirected to payment.`);
  };

  return (
    <div className="main-container">
      <div className="content" style={{ gridColumn: '1 / -1' }}>
        <div className="hero-section">
          <h2>
            <FontAwesomeIcon icon={faUserMd} /> Find Your Preferred Doctor
          </h2>
          <p>Connect with qualified healthcare professionals online</p>
        </div>

        <div className="service-descriptions">
          {doctors.map(doctor => (
            <div key={doctor.id} className="service-description">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  background: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '2rem'
                }}>
                  <FontAwesomeIcon icon={faUserMd} />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--primary)' }}>{doctor.name}</h3>
                  <p style={{ margin: '0.25rem 0', color: 'var(--text)', opacity: 0.8 }}>
                    {doctor.specialty}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FontAwesomeIcon icon={faStar} style={{ color: '#fbbf24' }} />
                    <span>{doctor.rating}</span>
                    <span style={{ opacity: 0.6 }}>• {doctor.experience} experience</span>
                  </div>
                </div>
              </div>

              <div style={{ 
                background: 'var(--light)', 
                padding: '1rem', 
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span><strong>Availability:</strong></span>
                  <span style={{ color: doctor.availability.includes('Now') ? '#10b981' : 'var(--text)' }}>
                    {doctor.availability}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span><strong>Consultation Fee:</strong></span>
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                    {doctor.consultationFee}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="btn-primary"
                  onClick={() => handleBookConsultation(doctor)}
                  style={{ flex: 1 }}
                >
                  <FontAwesomeIcon icon={faVideo} /> Video Call
                </button>
                <button 
                  className="btn-primary"
                  onClick={() => handleBookConsultation(doctor)}
                  style={{ flex: 1, background: 'var(--secondary)' }}
                >
                  <FontAwesomeIcon icon={faPhone} /> Voice Call
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="hero-section" style={{ marginTop: '2rem' }}>
          <h3>
            <FontAwesomeIcon icon={faCalendar} /> How It Works
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>1️⃣</div>
              <h4>Choose Doctor</h4>
              <p>Select from our qualified healthcare professionals</p>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>2️⃣</div>
              <h4>Book Appointment</h4>
              <p>Schedule at your convenient time</p>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>3️⃣</div>
              <h4>Get Consultation</h4>
              <p>Receive professional medical advice</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctor;
