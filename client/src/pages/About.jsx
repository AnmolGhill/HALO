import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeartbeat, 
  faRobot, 
  faUserMd, 
  faPills, 
  faBrain,
  faShieldAlt,
  faUsers,
  faClock
} from '@fortawesome/free-solid-svg-icons';

const About = () => {
  return (
    <div className="main-container">
      <div className="content" style={{ gridColumn: '1 / -1' }}>
        <div className="hero-section">
          <h2>
            <FontAwesomeIcon icon={faHeartbeat} /> About HALO
          </h2>
          <p>AI-Powered Healthcare Platform - Your Digital Health Companion</p>
        </div>

        <div className="service-descriptions">
          {/* Mission */}
          <div className="service-description">
            <h3>Our Mission</h3>
            <p>
              HALO is dedicated to revolutionizing healthcare accessibility through cutting-edge 
              artificial intelligence technology. We believe that quality healthcare guidance should 
              be available to everyone, anytime, anywhere. Our platform combines the power of AI 
              with medical expertise to provide reliable, instant health assistance.
            </p>
          </div>

          {/* What We Offer */}
          <div className="service-description">
            <h3>What We Offer</h3>
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <FontAwesomeIcon icon={faRobot} style={{ color: 'var(--primary)', fontSize: '1.5rem' }} />
                <div>
                  <h4 style={{ margin: 0, color: 'var(--primary)' }}>AI-Powered Symptom Analysis</h4>
                  <p style={{ margin: '0.25rem 0 0 0', opacity: 0.8 }}>
                    Advanced chatbot for instant symptom evaluation and health guidance
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <FontAwesomeIcon icon={faUserMd} style={{ color: 'var(--primary)', fontSize: '1.5rem' }} />
                <div>
                  <h4 style={{ margin: 0, color: 'var(--primary)' }}>Online Doctor Consultations</h4>
                  <p style={{ margin: '0.25rem 0 0 0', opacity: 0.8 }}>
                    Connect with qualified healthcare professionals via video or voice calls
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <FontAwesomeIcon icon={faPills} style={{ color: 'var(--primary)', fontSize: '1.5rem' }} />
                <div>
                  <h4 style={{ margin: 0, color: 'var(--primary)' }}>Medicine Recognition</h4>
                  <p style={{ margin: '0.25rem 0 0 0', opacity: 0.8 }}>
                    Identify medications and get detailed information about usage and side effects
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <FontAwesomeIcon icon={faBrain} style={{ color: 'var(--primary)', fontSize: '1.5rem' }} />
                <div>
                  <h4 style={{ margin: 0, color: 'var(--primary)' }}>Emotional Intelligence Assessment</h4>
                  <p style={{ margin: '0.25rem 0 0 0', opacity: 0.8 }}>
                    Evaluate and improve your emotional intelligence with professional assessments
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose HALO */}
          <div className="service-description">
            <h3>Why Choose HALO?</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <FontAwesomeIcon icon={faClock} style={{ fontSize: '2.5rem', color: 'var(--accent)', marginBottom: '0.5rem' }} />
                <h4 style={{ color: 'var(--primary)' }}>24/7 Availability</h4>
                <p>Access healthcare guidance anytime, day or night</p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <FontAwesomeIcon icon={faShieldAlt} style={{ fontSize: '2.5rem', color: 'var(--accent)', marginBottom: '0.5rem' }} />
                <h4 style={{ color: 'var(--primary)' }}>Privacy & Security</h4>
                <p>Your health data is protected with enterprise-grade security</p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <FontAwesomeIcon icon={faUsers} style={{ fontSize: '2.5rem', color: 'var(--accent)', marginBottom: '0.5rem' }} />
                <h4 style={{ color: 'var(--primary)' }}>Expert Network</h4>
                <p>Connected to qualified healthcare professionals worldwide</p>
              </div>
            </div>
          </div>

          {/* Technology */}
          <div className="service-description">
            <h3>Our Technology</h3>
            <p>
              HALO leverages state-of-the-art artificial intelligence, including advanced natural 
              language processing and machine learning algorithms, to provide accurate health 
              assessments. Our AI models are trained on vast medical datasets and continuously 
              updated with the latest medical research and guidelines.
            </p>
            <div style={{ 
              background: 'var(--light)', 
              padding: '1rem', 
              borderRadius: '8px', 
              marginTop: '1rem',
              border: '1px solid var(--border)'
            }}>
              <p style={{ margin: 0, fontStyle: 'italic', textAlign: 'center' }}>
                <strong>Powered by Google's Gemini AI</strong> - Ensuring reliable and up-to-date medical information
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="service-description" style={{ background: '#fef3cd', border: '1px solid #fbbf24' }}>
            <h3 style={{ color: '#92400e' }}>⚠️ Important Disclaimer</h3>
            <p style={{ color: '#92400e', margin: 0 }}>
              HALO provides health information and guidance for educational purposes only. 
              Our AI-powered tools are designed to supplement, not replace, professional medical advice. 
              Always consult with qualified healthcare providers for diagnosis, treatment, and medical decisions. 
              In case of medical emergencies, contact your local emergency services immediately.
            </p>
          </div>

          {/* Contact */}
          <div className="service-description">
            <h3>Get in Touch</h3>
            <p>
              Have questions or feedback? We'd love to hear from you. Our team is committed to 
              continuously improving HALO to better serve your healthcare needs.
            </p>
            <div style={{ marginTop: '1rem' }}>
              <p><strong>Email:</strong> support@halo.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Address:</strong> 123 Healthcare Ave, Medical District, CA 90210</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
