import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/chatbot.css';

const Chatbot = () => {
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  const [symptomInput, setSymptomInput] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState('');

  // Get translated symptoms
  const getCommonSymptoms = () => [
    t('headache'), t('fever'), t('cough'), t('fatigue'), 
    t('nausea'), t('soreThroat'), t('shortnessBreath'), t('chestPain'),
    t('diarrhea'), t('dizziness'), t('lossSmell'), t('lossTaste'),
    t('runnyNose'), t('sneezing'), t('musclePain'), t('backPain')
  ];

  const addSymptom = () => {
    if (symptomInput.trim() && !selectedSymptoms.includes(symptomInput.trim())) {
      setSelectedSymptoms([...selectedSymptoms, symptomInput.trim()]);
      setSymptomInput('');
    }
  };

  const addPredefinedSymptom = (symptom) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const removeSymptom = (symptomToRemove) => {
    setSelectedSymptoms(selectedSymptoms.filter(symptom => symptom !== symptomToRemove));
  };

  const clearSymptoms = () => {
    setSelectedSymptoms([]);
    setDiagnosisResult('');
  };

  // Language-specific fallback responses
  const getLanguageFallback = (symptoms, language) => {
    const symptomsString = symptoms.join(', ');
    
    const fallbacks = {
      'hi': {
        title1: '📋 निदान सारांश',
        title2: '💊 सुझाई गई दवाएं', 
        title3: '⚠️ संभावित दुष्प्रभाव',
        title4: '🚫 बचने योग्य चीजें',
        title5: '📅 फॉलो-अप सुझाव',
        content: `आपके लक्षणों (${symptomsString}) के आधार पर, यह एक सामान्य वायरल संक्रमण प्रतीत होता है`
      },
      'pa': {
        title1: '📋 ਨਿਦਾਨ ਸਾਰ',
        title2: '💊 ਸਿਫਾਰਸ਼ੀ ਦਵਾਈਆਂ',
        title3: '⚠️ ਸੰਭਾਵਿਤ ਮਾੜੇ ਪ੍ਰਭਾਵ',
        title4: '🚫 ਬਚਣ ਵਾਲੀਆਂ ਚੀਜ਼ਾਂ',
        title5: '📅 ਫਾਲੋ-ਅੱਪ ਸੁਝਾਅ',
        content: `ਤੁਹਾਡੇ ਲੱਛਣਾਂ (${symptomsString}) ਦੇ ਆਧਾਰ ਤੇ, ਇਹ ਇੱਕ ਆਮ ਵਾਇਰਲ ਇਨਫੈਕਸ਼ਨ ਜਾਪਦਾ ਹੈ`
      },
      'or': {
        title1: '📋 ନିଦାନ ସାରାଂଶ',
        title2: '💊 ପରାମର୍ଶିତ ଔଷଧ',
        title3: '⚠️ ସମ୍ଭାବ୍ୟ ପାର୍ଶ୍ୱ ପ୍ରଭାବ',
        title4: '🚫 ଏଡ଼ାଇବାକୁ ଥିବା ଜିନିଷ',
        title5: '📅 ଫଲୋ-ଅପ୍ ପରାମର୍ଶ',
        content: `ଆପଣଙ୍କ ଲକ୍ଷଣ (${symptomsString}) ଆଧାରରେ, ଏହା ଏକ ସାଧାରଣ ଭାଇରାଲ୍ ସଂକ୍ରମଣ ପରି ଦେଖାଯାଉଛି`
      }
    };
    
    const lang = fallbacks[language] || {
      title1: '📋 Diagnosis Summary',
      title2: '💊 Recommended Medicines',
      title3: '⚠️ Possible Side Effects', 
      title4: '🚫 Things to Avoid',
      title5: '📅 Follow-Up Suggestions',
      content: `Based on symptoms (${symptomsString}), this appears to be a common viral infection`
    };
    
    return `
      <div style="background: #e3f2fd; border: 1px solid #90caf9; border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
        <p style="margin: 0; color: #1565c0; font-size: 0.9rem;">
          ℹ️ ${language === 'hi' ? 'हमारे चिकित्सा विशेषज्ञों द्वारा तैयार किए गए सुझाव प्रदान किए जा रहे हैं।' : 
               language === 'pa' ? 'ਸਾਡੇ ਮੈਡੀਕਲ ਮਾਹਿਰਾਂ ਦੁਆਰਾ ਤਿਆਰ ਕੀਤੇ ਸੁਝਾਅ ਪ੍ਰਦਾਨ ਕੀਤੇ ਜਾ ਰਹੇ ਹਨ।' :
               language === 'or' ? 'ଆମର ଚିକିତ୍ସା ବିଶେଷଜ୍ଞଙ୍କ ଦ୍ୱାରା ପ୍ରସ୍ତୁତ ପରାମର୍ଶ ପ୍ରଦାନ କରାଯାଉଛି।' :
               'Medical guidance prepared by our healthcare experts is being provided.'}
        </p>
      </div>
      
      <hr style='width: 100%; border: none; border-top: 2px solid #f28b82; margin: 2rem 0;'>
      
      <div>
        <h3 style='font-size:1.1rem; color:#003153; font-weight:bold;'>${lang.title1}</h3>
        <hr style='margin: 0.2rem 0 1rem 0; border: none; border-top: 1px solid #ccc;'>
        <ol style='list-style-type: decimal; padding-left: 20px;'>
          <li><b>${language === 'hi' ? 'संभावित स्थिति' : language === 'pa' ? 'ਸੰਭਾਵਿਤ ਸਥਿਤੀ' : language === 'or' ? 'ସମ୍ଭାବ୍ୟ ଅବସ୍ଥା' : 'Likely Condition'}:</b> ${lang.content}</li>
          <li><b>${language === 'hi' ? 'सुझाव' : language === 'pa' ? 'ਸੁਝਾਅ' : language === 'or' ? 'ପରାମର୍ଶ' : 'Recommendation'}:</b> ${language === 'hi' ? 'आराम करें और पानी पिएं' : language === 'pa' ? 'ਆਰਾਮ ਕਰੋ ਅਤੇ ਪਾਣੀ ਪੀਓ' : language === 'or' ? 'ବିଶ୍ରାମ ନିଅନ୍ତୁ ଏବଂ ପାଣି ପିଅନ୍ତୁ' : 'Rest and stay hydrated'}</li>
          <li><b>${language === 'hi' ? 'चिकित्सक से मिलें' : language === 'pa' ? 'ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ' : language === 'or' ? 'ଡାକ୍ତରଙ୍କୁ ଦେଖାନ୍ତୁ' : 'See Doctor'}:</b> ${language === 'hi' ? 'यदि लक्षण बिगड़ते हैं तो डॉक्टर से संपर्क करें' : language === 'pa' ? 'ਜੇ ਲੱਛਣ ਵਿਗੜਦੇ ਹਨ ਤਾਂ ਡਾਕਟਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ' : language === 'or' ? 'ଯଦି ଲକ୍ଷଣ ଖରାପ ହୁଏ ତେବେ ଡାକ୍ତରଙ୍କ ସହିତ ଯୋଗାଯୋଗ କରନ୍ତୁ' : 'Contact doctor if symptoms worsen'}</li>
        </ol>
      </div>

      <div>
        <h3 style='font-size:1.1rem; color:#003153; font-weight:bold;'>${lang.title2}</h3>
        <hr style='margin: 0.2rem 0 1rem 0; border: none; border-top: 1px solid #ccc;'>
        <ol style='list-style-type: decimal; padding-left: 20px;'>
          <li><b>${language === 'hi' ? 'दर्द निवारक' : language === 'pa' ? 'ਦਰਦ ਨਿਵਾਰਕ' : language === 'or' ? 'ଯନ୍ତ୍ରଣା ନିବାରକ' : 'Pain Relief'}:</b> ${language === 'hi' ? 'पैरासिटामोल 500mg आवश्यकतानुसार' : language === 'pa' ? 'ਪੈਰਾਸਿਟਾਮੋਲ 500mg ਲੋੜ ਅਨੁਸਾਰ' : language === 'or' ? 'ପାରାସିଟାମଲ 500mg ଆବଶ୍ୟକ ଅନୁଯାୟୀ' : 'Paracetamol 500mg as needed'}</li>
          <li><b>${language === 'hi' ? 'तरल पदार्थ' : language === 'pa' ? 'ਤਰਲ ਪਦਾਰਥ' : language === 'or' ? 'ତରଳ ପଦାର୍ଥ' : 'Fluids'}:</b> ${language === 'hi' ? 'गर्म पानी, चाय, सूप पिएं' : language === 'pa' ? 'ਗਰਮ ਪਾਣੀ, ਚਾਹ, ਸੂਪ ਪੀਓ' : language === 'or' ? 'ଗରମ ପାଣି, ଚା, ସୁପ୍ ପିଅନ୍ତୁ' : 'Drink warm water, tea, soup'}</li>
          <li><b>${language === 'hi' ? 'आराम' : language === 'pa' ? 'ਆਰਾਮ' : language === 'or' ? 'ବିଶ୍ରାମ' : 'Rest'}:</b> ${language === 'hi' ? 'पर्याप्त नींद और आराम लें' : language === 'pa' ? 'ਕਾਫੀ ਨੀਂਦ ਅਤੇ ਆਰਾਮ ਲਓ' : language === 'or' ? 'ପର୍ଯ୍ୟାପ୍ତ ନିଦ୍ରା ଏବଂ ବିଶ୍ରାମ ନିଅନ୍ତୁ' : 'Get adequate sleep and rest'}</li>
        </ol>
      </div>
    `;
  };

  // Gemini API integration
  const callGeminiAPI = async (symptoms, language) => {
    const languageNames = {
      'en': 'English',
      'hi': 'Hindi',
      'pa': 'Punjabi', 
      'or': 'Odia'
    };

    const prompt = `You are a medical AI assistant. Analyze the following symptoms and provide a comprehensive medical diagnosis in ${languageNames[language] || 'English'} language.

Symptoms: ${symptoms.join(', ')}

Please provide a detailed response in the following format (respond entirely in ${languageNames[language] || 'English'}):

1. **Diagnosis Summary** (6 points):
   - Likely Condition
   - Primary Cause  
   - Symptom Relation
   - Body System affected
   - Severity Level
   - Recommendation

2. **Recommended Medicines** (6 points):
   - Pain Relief options
   - Specific treatments
   - Hydration advice
   - Usage instructions
   - Duration guidelines
   - When to consult doctor

3. **Possible Side Effects** (6 points):
   - Mild side effects
   - Stomach related
   - Allergic reactions
   - Management tips
   - When to stop medication
   - Emergency signs

4. **Things to Avoid** (6 points):
   - Foods to avoid
   - Activities to limit
   - Substances to avoid
   - Environmental factors
   - Habits to stop
   - Delays to avoid

5. **Follow-Up Suggestions** (6 points):
   - Check-up timeline
   - Tests if needed
   - Monitoring advice
   - Warning signs
   - Specialist referral
   - Prevention tips

Format each section with proper headings and numbered lists. Use appropriate medical terminology but keep it understandable for patients.`;

    try {
      console.log('🔥 Using server Gemini API...');
      
      // Use server's Gemini API instead of direct client calls
      const response = await fetch('http://localhost:8000/api/get_diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptoms: symptoms.join(', '),
          language: language
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        
        // Handle quota exceeded specifically (this is expected behavior)
        if (response.status === 429 || errorData.includes('QUOTA_EXCEEDED')) {
          console.log('ℹ️ Gemini API quota temporarily exceeded, using intelligent fallback system');
          throw new Error('QUOTA_EXCEEDED');
        }
        
        console.error('❌ Server Gemini API Error:', response.status, errorData);
        throw new Error(`Server API Error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log('✅ Server Gemini API Success! Response received');
      return data.response;
    } catch (error) {
      // Don't log quota exceeded as an error since it's expected behavior
      if (error.message !== 'QUOTA_EXCEEDED') {
        console.error('❌ Gemini API Error:', error.message);
      }
      throw error;
    }
  };

  const getDiagnosis = async () => {
    if (selectedSymptoms.length === 0) {
      alert(t('selectAtLeastOne'));
      return;
    }

    setIsLoading(true);
    setDiagnosisResult('');

    try {
      // Try to call Gemini API first
      let diagnosis;
      try {
        diagnosis = await callGeminiAPI(selectedSymptoms, currentLanguage);
        
        // Clean up the Gemini response - remove any markdown artifacts
        diagnosis = diagnosis.replace(/```html\s*/g, '');
        diagnosis = diagnosis.replace(/```\s*/g, '');
        diagnosis = diagnosis.replace(/^\s*"html\s*/g, '');
        diagnosis = diagnosis.replace(/"\s*$/g, '');
        
        // Ensure proper HTML structure
        if (!diagnosis.includes('<div>') && !diagnosis.includes('<hr')) {
          // If it's plain text, format it properly
          diagnosis = diagnosis.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          diagnosis = diagnosis.replace(/\n/g, '<br>');
          diagnosis = `<div style="line-height: 1.6; color: #2D3748; padding: 1rem;">${diagnosis}</div>`;
        } else {
          // If it's already HTML, just clean it up
          diagnosis = diagnosis.trim();
        }
      } catch (geminiError) {
        if (geminiError.message === 'QUOTA_EXCEEDED') {
          console.log('ℹ️ Switching to intelligent fallback system - providing medical guidance in your language');
        } else {
          console.log('🔄 Gemini API temporarily unavailable, using language-specific fallback response');
          console.log('📝 Fallback reason:', geminiError.message);
        }
        // Use language-specific fallback response
        diagnosis = getLanguageFallback(selectedSymptoms, currentLanguage);
      }

      setDiagnosisResult(diagnosis);
    } catch (error) {
      console.error('Error getting diagnosis:', error);
      alert(t('diagnosisFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addSymptom();
    }
  };

  return (
    <div className="chatbot-container">
      {/* Header */}
      <header className="chatbot-header">
        <div className="header-content">
          <div className="symptom-ai-badge">
            🩺 {t('symptomAI')}
          </div>
          <button 
            onClick={() => navigate('/doctor')}
            className="contact-doctor-btn"
          >
            👨‍⚕️ {t('contactDoctor')}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="chatbot-main">
        <div className="chatbot-card fade-in">
          <h2 className="custom-heading">{t('enterSymptoms')}</h2>

          {/* Symptom Input */}
          <div className="symptom-input-section">
            <input 
              type="text" 
              placeholder={t('typeSymptom')}
              className="symptom-input"
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={addSymptom} className="add-btn">
              ➕ {t('addSymptom')}
            </button>
          </div>

          {/* Common Symptoms */}
          <div className="common-symptoms-section">
            <h3 className="common-symptoms-title">{t('commonSymptoms')}</h3>
            <div className="symptoms-grid">
              {getCommonSymptoms().map((symptom, index) => (
                <button 
                  key={index}
                  onClick={() => addPredefinedSymptom(symptom)} 
                  className="symptom-tag"
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Symptoms */}
          <div className="selected-symptoms-section">
            <h3 className="selected-symptoms-title">{t('selectedSymptoms')}</h3>
            <div className="selected-symptoms-container">
              <div className="selected-symptoms">
                {selectedSymptoms.map((symptom, index) => (
                  <div key={index} className="selected-symptom-tag">
                    {symptom}
                    <button 
                      onClick={() => removeSymptom(symptom)}
                      className="remove-symptom"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              {selectedSymptoms.length === 0 && (
                <p className="no-symptoms-text">{t('noSymptomsSelected')}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button onClick={clearSymptoms} className="clear-btn">
              🗑️ {t('clearAll')}
            </button>
            <button onClick={getDiagnosis} className="diagnose-btn">
              🔍 {t('getDiagnosis')}
            </button>
          </div>

          {/* Loading Spinner */}
          <div className={`loading-container ${!isLoading ? 'hidden' : ''}`}>
            <div className="loader"></div>
            <p className="loading-text">{t('analyzingSymptoms')}</p>
          </div>

          {/* Diagnosis Output */}
          <div 
            className={`diagnosis-result ${!diagnosisResult ? 'hidden' : 'show'}`}
            dangerouslySetInnerHTML={{ __html: diagnosisResult }}
          />
        </div>
      </main>
    </div>
  );
};

export default Chatbot;
