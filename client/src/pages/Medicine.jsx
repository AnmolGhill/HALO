import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPills, faCamera, faUpload, faSearch, faInfo } from '@fortawesome/free-solid-svg-icons';

const Medicine = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeMedicine = async () => {
    if (!selectedImage) {
      alert('Please upload an image first');
      return;
    }

    setIsAnalyzing(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock analysis result
      const mockResult = {
        name: 'Paracetamol 500mg',
        genericName: 'Acetaminophen',
        manufacturer: 'Generic Pharma',
        uses: [
          'Pain relief (headache, toothache, muscle pain)',
          'Fever reduction',
          'Cold and flu symptoms'
        ],
        dosage: {
          adults: '500mg-1000mg every 4-6 hours',
          children: 'Consult pediatrician for proper dosage',
          maxDaily: 'Do not exceed 4000mg in 24 hours'
        },
        sideEffects: [
          'Rare: Nausea, stomach upset',
          'Serious: Liver damage (with overdose)',
          'Allergic reactions (rash, swelling)'
        ],
        warnings: [
          'Do not exceed recommended dose',
          'Avoid alcohol while taking this medication',
          'Consult doctor if symptoms persist beyond 3 days',
          'Not suitable for people with liver problems'
        ]
      };

      setAnalysisResult(mockResult);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze medicine. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="main-container">
      <div className="content" style={{ gridColumn: '1 / -1' }}>
        <div className="hero-section">
          <h2>
            <FontAwesomeIcon icon={faPills} /> Medicine Recognition
          </h2>
          <p>Upload a photo of your medication to get detailed information</p>
        </div>

        <div className="service-descriptions">
          {/* Upload Section */}
          <div className="service-description">
            <h3>
              <FontAwesomeIcon icon={faUpload} /> Upload Medicine Image
            </h3>
            
            <div style={{ 
              border: '2px dashed var(--border)', 
              borderRadius: '12px', 
              padding: '2rem', 
              textAlign: 'center',
              marginBottom: '1rem'
            }}>
              {selectedImage ? (
                <div>
                  <img 
                    src={selectedImage} 
                    alt="Selected medicine" 
                    style={{ 
                      maxWidth: '300px', 
                      maxHeight: '300px', 
                      borderRadius: '8px',
                      marginBottom: '1rem'
                    }} 
                  />
                  <div>
                    <button 
                      className="btn-primary"
                      onClick={analyzeMedicine}
                      disabled={isAnalyzing}
                      style={{ marginRight: '0.5rem' }}
                    >
                      <FontAwesomeIcon icon={faSearch} />
                      {isAnalyzing ? ' Analyzing...' : ' Analyze Medicine'}
                    </button>
                    <label className="btn-primary" style={{ background: 'var(--secondary)' }}>
                      <FontAwesomeIcon icon={faCamera} /> Change Image
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div>
                  <FontAwesomeIcon icon={faCamera} style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: '1rem' }} />
                  <p style={{ marginBottom: '1rem' }}>Click to upload an image of your medicine</p>
                  <label className="btn-primary">
                    <FontAwesomeIcon icon={faUpload} /> Upload Image
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              )}
            </div>

            {isAnalyzing && (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div className="loader" style={{ margin: '0 auto 1rem auto' }}></div>
                <p>Analyzing medicine image...</p>
              </div>
            )}
          </div>

          {/* Analysis Result */}
          {analysisResult && (
            <div className="service-description">
              <h3>
                <FontAwesomeIcon icon={faInfo} /> Analysis Result
              </h3>
              
              <div style={{ background: 'var(--light)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
                  {analysisResult.name}
                </h4>
                <p><strong>Generic Name:</strong> {analysisResult.genericName}</p>
                <p><strong>Manufacturer:</strong> {analysisResult.manufacturer}</p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Uses:</h4>
                <ul>
                  {analysisResult.uses.map((use, index) => (
                    <li key={index}>{use}</li>
                  ))}
                </ul>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Dosage:</h4>
                <div style={{ background: 'var(--light)', padding: '1rem', borderRadius: '8px' }}>
                  <p><strong>Adults:</strong> {analysisResult.dosage.adults}</p>
                  <p><strong>Children:</strong> {analysisResult.dosage.children}</p>
                  <p><strong>Maximum Daily:</strong> {analysisResult.dosage.maxDaily}</p>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Side Effects:</h4>
                <ul>
                  {analysisResult.sideEffects.map((effect, index) => (
                    <li key={index}>{effect}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>⚠️ Important Warnings:</h4>
                <ul>
                  {analysisResult.warnings.map((warning, index) => (
                    <li key={index} style={{ color: '#ef4444' }}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="service-description">
            <h3>
              <FontAwesomeIcon icon={faInfo} /> How to Use
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📸</div>
                <h4>Take Clear Photo</h4>
                <p>Ensure the medicine name and details are clearly visible</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⬆️</div>
                <h4>Upload Image</h4>
                <p>Select the image from your device</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
                <h4>Get Information</h4>
                <p>Receive detailed medicine information instantly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Medicine;
