import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Navbar
    brand: 'HALO',
    about: 'About',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    
    // Services
    healthcareBot: 'Healthcare Chatbot',
    healthcareBotDesc: '24/7 AI-powered medical assistance',
    doctorPreference: 'Doctor Preference (Online)',
    doctorPreferenceDesc: 'Select your preferred online doctor',
    medicineRecognition: 'Medicine Recognition',
    medicineRecognitionDesc: 'Identify medications instantly',
    eqAssessment: 'EQ Assessment',
    eqAssessmentDesc: 'Evaluate emotional intelligence',
    whatsappServices: 'WhatsApp Services',
    whatsappServicesDesc: 'Connect via WhatsApp for instant support',
    
    // Home Page
    heroTitle: 'Healthcare AI Linked Operations',
    heroDesc: 'Experience AI-driven medical solutions at your fingertips.',
    healthOverview: 'Your Health Overview',
    weight: 'Weight',
    height: 'Height',
    bloodType: 'Blood Type',
    recentHistory: 'Recent Medical History',
    healthMetrics: 'Health Metrics',
    lastCheckup: 'Last Checkup',
    vaccination: 'Vaccination',
    
    // Connection Status
    serverConnection: 'Server Connection Status',
    connected: 'Connected to server',
    connectionFailed: 'Connection failed',
    testConnection: 'Test Connection',
    
    // Service Descriptions
    healthcareBotLongDesc: 'Our AI-powered chatbot provides instant medical guidance, symptom analysis, and healthcare recommendations. Available 24/7, it offers reliable preliminary medical advice while maintaining complete privacy.',
    medicineRecognitionLongDesc: 'Advanced medicine identification system that helps you recognize medications, understand their uses, proper dosage, and potential side effects. Simply upload a photo of your medication for instant information.',
    eqAssessmentLongDesc: 'Professional emotional intelligence evaluation tool that helps assess and improve your emotional awareness, empathy, and social skills. Get personalized insights and development recommendations.',
    whatsappServicesLongDesc: 'Connect instantly with our healthcare support team via WhatsApp. Get quick answers to your health questions, schedule appointments, receive medication reminders, and access emergency assistance through your favorite messaging platform.',
    
    // Medical History
    regularCheckup: 'Regular health examination completed',
    fluShot: 'Annual flu shot administered',
    weeksAgo: 'weeks ago',
    monthAgo: 'month ago',
    normal: 'Normal',
    
    // Chatbot
    symptomAI: 'Symptom AI',
    contactDoctor: 'Contact Doctor',
    enterSymptoms: 'Enter Your Symptoms',
    typeSymptom: 'Type a symptom (e.g. Headache)',
    addSymptom: 'Add Symptom',
    commonSymptoms: 'Common Symptoms',
    selectedSymptoms: 'Selected Symptoms',
    noSymptomsSelected: 'No symptoms selected yet.',
    clearAll: 'Clear All',
    getDiagnosis: 'Get Diagnosis',
    analyzingSymptoms: 'Analyzing symptoms...',
    selectAtLeastOne: 'Please select at least one symptom.',
    diagnosisFailed: 'Failed to get diagnosis. Please try again.',
    
    // Symptoms
    headache: 'Headache',
    fever: 'Fever',
    cough: 'Cough',
    fatigue: 'Fatigue',
    nausea: 'Nausea',
    soreThroat: 'Sore Throat',
    shortnessBreath: 'Shortness of Breath',
    chestPain: 'Chest Pain',
    diarrhea: 'Diarrhea',
    dizziness: 'Dizziness',
    lossSmell: 'Loss of Smell',
    lossTaste: 'Loss of Taste',
    runnyNose: 'Runny Nose',
    sneezing: 'Sneezing',
    musclePain: 'Muscle Pain',
    backPain: 'Back Pain'
  },
  
  hi: {
    // Navbar
    brand: 'आरोग्य AI',
    about: 'के बारे में',
    login: 'लॉगिन',
    register: 'रजिस्टर',
    logout: 'लॉगआउट',
    
    // Services
    healthcareBot: 'स्वास्थ्य चैटबॉट',
    healthcareBotDesc: '24/7 AI-संचालित चिकित्सा सहायता',
    doctorPreference: 'डॉक्टर प्राथमिकता (ऑनलाइन)',
    doctorPreferenceDesc: 'अपना पसंदीदा ऑनलाइन डॉक्टर चुनें',
    medicineRecognition: 'दवा पहचान',
    medicineRecognitionDesc: 'दवाओं को तुरंत पहचानें',
    eqAssessment: 'EQ मूल्यांकन',
    eqAssessmentDesc: 'भावनात्मक बुद्धिमत्ता का मूल्यांकन करें',
    whatsappServices: 'व्हाट्सऐप सेवाएं',
    whatsappServicesDesc: 'तत्काल सहायता के लिए व्हाट्सऐप से जुड़ें',
    
    // Home Page
    heroTitle: 'स्वास्थ्य AI लिंक्ड ऑपरेशन्स',
    heroDesc: 'अपनी उंगलियों पर AI-संचालित चिकित्सा समाधान का अनुभव करें।',
    healthOverview: 'आपका स्वास्थ्य अवलोकन',
    weight: 'वजन',
    height: 'ऊंचाई',
    bloodType: 'रक्त समूह',
    recentHistory: 'हाल का चिकित्सा इतिहास',
    healthMetrics: 'स्वास्थ्य मेट्रिक्स',
    lastCheckup: 'अंतिम जांच',
    vaccination: 'टीकाकरण',
    
    // Connection Status
    serverConnection: 'सर्वर कनेक्शन स्थिति',
    connected: 'सर्वर से जुड़ा हुआ',
    connectionFailed: 'कनेक्शन विफल',
    testConnection: 'कनेक्शन परीक्षण',
    
    // Service Descriptions
    healthcareBotLongDesc: 'हमारा AI-संचालित चैटबॉट तत्काल चिकित्सा मार्गदर्शन, लक्षण विश्लेषण और स्वास्थ्य सिफारिशें प्रदान करता है। 24/7 उपलब्ध, यह पूर्ण गोपनीयता बनाए रखते हुए विश्वसनीय प्रारंभिक चिकित्सा सलाह प्रदान करता है।',
    medicineRecognitionLongDesc: 'उन्नत दवा पहचान प्रणाली जो आपको दवाओं को पहचानने, उनके उपयोग, उचित खुराक और संभावित दुष्प्रभावों को समझने में मदद करती है। तत्काल जानकारी के लिए बस अपनी दवा की एक तस्वीर अपलोड करें।',
    eqAssessmentLongDesc: 'पेशेवर भावनात्मक बुद्धिमत्ता मूल्यांकन उपकरण जो आपकी भावनात्मक जागरूकता, सहानुभूति और सामाजिक कौशल का आकलन और सुधार करने में मदद करता है। व्यक्तिगत अंतर्दृष्टि और विकास सिफारिशें प्राप्त करें।',
    whatsappServicesLongDesc: 'व्हाट्सऐप के माध्यम से हमारी स्वास्थ्य सहायता टीम से तुरंत जुड़ें। अपने स्वास्थ्य प्रश्नों के त्वरित उत्तर प्राप्त करें, अपॉइंटमेंट शेड्यूल करें, दवा रिमाइंडर प्राप्त करें, और अपने पसंदीदा मैसेजिंग प्लेटफॉर्म के माध्यम से आपातकालीन सहायता प्राप्त करें।',
    
    // Medical History
    regularCheckup: 'नियमित स्वास्थ्य परीक्षा पूर्ण',
    fluShot: 'वार्षिक फ्लू शॉट दिया गया',
    weeksAgo: 'सप्ताह पहले',
    monthAgo: 'महीने पहले',
    normal: 'सामान्य',
    
    // Chatbot
    symptomAI: 'लक्षण AI',
    contactDoctor: 'डॉक्टर से संपर्क करें',
    enterSymptoms: 'अपने लक्षण दर्ज करें',
    typeSymptom: 'एक लक्षण टाइप करें (जैसे सिरदर्द)',
    addSymptom: 'लक्षण जोड़ें',
    commonSymptoms: 'सामान्य लक्षण',
    selectedSymptoms: 'चयनित लक्षण',
    noSymptomsSelected: 'अभी तक कोई लक्षण नहीं चुना गया।',
    clearAll: 'सभी साफ़ करें',
    getDiagnosis: 'निदान प्राप्त करें',
    analyzingSymptoms: 'लक्षणों का विश्लेषण कर रहे हैं...',
    selectAtLeastOne: 'कृपया कम से कम एक लक्षण चुनें।',
    diagnosisFailed: 'निदान प्राप्त करने में विफल। कृपया पुनः प्रयास करें।',
    
    // Symptoms
    headache: 'सिरदर्द',
    fever: 'बुखार',
    cough: 'खांसी',
    fatigue: 'थकान',
    nausea: 'मतली',
    soreThroat: 'गले में खराश',
    shortnessBreath: 'सांस की तकलीफ',
    chestPain: 'छाती में दर्द',
    diarrhea: 'दस्त',
    dizziness: 'चक्कर आना',
    lossSmell: 'गंध की हानि',
    lossTaste: 'स्वाद की हानि',
    runnyNose: 'नाक बहना',
    sneezing: 'छींकना',
    musclePain: 'मांसपेशियों में दर्द',
    backPain: 'पीठ दर्द'
  },
  
  pa: {
    // Navbar
    brand: 'ਆਰੋਗਿਆ AI',
    about: 'ਬਾਰੇ',
    login: 'ਲਾਗਇਨ',
    register: 'ਰਜਿਸਟਰ',
    logout: 'ਲਾਗਆਉਟ',
    
    // Services
    healthcareBot: 'ਸਿਹਤ ਚੈਟਬੋਟ',
    healthcareBotDesc: '24/7 AI-ਸੰਚਾਲਿਤ ਮੈਡੀਕਲ ਸਹਾਇਤਾ',
    doctorPreference: 'ਡਾਕਟਰ ਤਰਜੀਹ (ਔਨਲਾਈਨ)',
    doctorPreferenceDesc: 'ਆਪਣਾ ਪਸੰਦੀਦਾ ਔਨਲਾਈਨ ਡਾਕਟਰ ਚੁਣੋ',
    medicineRecognition: 'ਦਵਾਈ ਪਛਾਣ',
    medicineRecognitionDesc: 'ਦਵਾਈਆਂ ਨੂੰ ਤੁਰੰਤ ਪਛਾਣੋ',
    eqAssessment: 'EQ ਮੁਲਾਂਕਣ',
    eqAssessmentDesc: 'ਭਾਵਨਾਤਮਕ ਬੁੱਧੀ ਦਾ ਮੁਲਾਂਕਣ ਕਰੋ',
    whatsappServices: 'ਵਟਸਐਪ ਸੇਵਾਵਾਂ',
    whatsappServicesDesc: 'ਤੁਰੰਤ ਸਹਾਇਤਾ ਲਈ ਵਟਸਐਪ ਰਾਹੀਂ ਜੁੜੋ',
    
    // Home Page
    heroTitle: 'ਸਿਹਤ AI ਲਿੰਕਡ ਔਪਰੇਸ਼ਨਜ਼',
    heroDesc: 'ਆਪਣੀਆਂ ਉਂਗਲਾਂ ਤੇ AI-ਸੰਚਾਲਿਤ ਮੈਡੀਕਲ ਹੱਲਾਂ ਦਾ ਅਨੁਭਵ ਕਰੋ।',
    healthOverview: 'ਤੁਹਾਡਾ ਸਿਹਤ ਅਵਲੋਕਨ',
    weight: 'ਭਾਰ',
    height: 'ਉਚਾਈ',
    bloodType: 'ਖੂਨ ਦੀ ਕਿਸਮ',
    recentHistory: 'ਹਾਲੀਆ ਮੈਡੀਕਲ ਇਤਿਹਾਸ',
    healthMetrics: 'ਸਿਹਤ ਮੈਟ੍ਰਿਕਸ',
    lastCheckup: 'ਪਿਛਲੀ ਜਾਂਚ',
    vaccination: 'ਟੀਕਾਕਰਨ',
    
    // Connection Status
    serverConnection: 'ਸਰਵਰ ਕਨੈਕਸ਼ਨ ਸਥਿਤੀ',
    connected: 'ਸਰਵਰ ਨਾਲ ਜੁੜਿਆ',
    connectionFailed: 'ਕਨੈਕਸ਼ਨ ਅਸਫਲ',
    testConnection: 'ਕਨੈਕਸ਼ਨ ਟੈਸਟ',
    
    // Service Descriptions
    healthcareBotLongDesc: 'ਸਾਡਾ AI-ਸੰਚਾਲਿਤ ਚੈਟਬੋਟ ਤੁਰੰਤ ਮੈਡੀਕਲ ਮਾਰਗਦਰਸ਼ਨ, ਲੱਛਣ ਵਿਸ਼ਲੇਸ਼ਣ ਅਤੇ ਸਿਹਤ ਸਿਫਾਰਸ਼ਾਂ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ। 24/7 ਉਪਲਬਧ, ਇਹ ਪੂਰੀ ਗੁਪਤਤਾ ਬਣਾਈ ਰੱਖਦੇ ਹੋਏ ਭਰੋਸੇਮੰਦ ਸ਼ੁਰੂਆਤੀ ਮੈਡੀਕਲ ਸਲਾਹ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ।',
    medicineRecognitionLongDesc: 'ਉੱਨਤ ਦਵਾਈ ਪਛਾਣ ਸਿਸਟਮ ਜੋ ਤੁਹਾਨੂੰ ਦਵਾਈਆਂ ਨੂੰ ਪਛਾਣਨ, ਉਹਨਾਂ ਦੀ ਵਰਤੋਂ, ਸਹੀ ਖੁਰਾਕ ਅਤੇ ਸੰਭਾਵਿਤ ਮਾੜੇ ਪ੍ਰਭਾਵਾਂ ਨੂੰ ਸਮਝਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ। ਤੁਰੰਤ ਜਾਣਕਾਰੀ ਲਈ ਬਸ ਆਪਣੀ ਦਵਾਈ ਦੀ ਇੱਕ ਤਸਵੀਰ ਅਪਲੋਡ ਕਰੋ।',
    eqAssessmentLongDesc: 'ਪੇਸ਼ੇਵਰ ਭਾਵਨਾਤਮਕ ਬੁੱਧੀ ਮੁਲਾਂਕਣ ਟੂਲ ਜੋ ਤੁਹਾਡੀ ਭਾਵਨਾਤਮਕ ਜਾਗਰੂਕਤਾ, ਹਮਦਰਦੀ ਅਤੇ ਸਮਾਜਿਕ ਹੁਨਰਾਂ ਦਾ ਮੁਲਾਂਕਣ ਅਤੇ ਸੁਧਾਰ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ। ਵਿਅਕਤੀਗਤ ਸੂਝ ਅਤੇ ਵਿਕਾਸ ਸਿਫਾਰਸ਼ਾਂ ਪ੍ਰਾਪਤ ਕਰੋ।',
    whatsappServicesLongDesc: 'ਵਟਸਐਪ ਰਾਹੀਂ ਸਾਡੀ ਸਿਹਤ ਸਹਾਇਤਾ ਟੀਮ ਨਾਲ ਤੁਰੰਤ ਜੁੜੋ। ਆਪਣੇ ਸਿਹਤ ਸਵਾਲਾਂ ਦੇ ਤੁਰੰਤ ਜਵਾਬ ਪਾਓ, ਮੁਲਾਕਾਤਾਂ ਸ਼ੈਡਿਊਲ ਕਰੋ, ਦਵਾਈ ਰਿਮਾਈਂਡਰ ਪ੍ਰਾਪਤ ਕਰੋ, ਅਤੇ ਆਪਣੇ ਪਸੰਦੀਦਾ ਮੈਸੇਜਿੰਗ ਪਲੇਟਫਾਰਮ ਰਾਹੀਂ ਐਮਰਜੈਂਸੀ ਸਹਾਇਤਾ ਪ੍ਰਾਪਤ ਕਰੋ।',
    
    // Medical History
    regularCheckup: 'ਨਿਯਮਤ ਸਿਹਤ ਜਾਂਚ ਪੂਰੀ',
    fluShot: 'ਸਾਲਾਨਾ ਫਲੂ ਸ਼ਾਟ ਦਿੱਤਾ ਗਿਆ',
    weeksAgo: 'ਹਫ਼ਤੇ ਪਹਿਲਾਂ',
    monthAgo: 'ਮਹੀਨਾ ਪਹਿਲਾਂ',
    normal: 'ਸਾਧਾਰਨ',
    
    // Chatbot
    symptomAI: 'ਲੱਛਣ AI',
    contactDoctor: 'ਡਾਕਟਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ',
    enterSymptoms: 'ਆਪਣੇ ਲੱਛਣ ਦਰਜ ਕਰੋ',
    typeSymptom: 'ਇੱਕ ਲੱਛਣ ਟਾਈਪ ਕਰੋ (ਜਿਵੇਂ ਸਿਰ ਦਰਦ)',
    addSymptom: 'ਲੱਛਣ ਸ਼ਾਮਲ ਕਰੋ',
    commonSymptoms: 'ਆਮ ਲੱਛਣ',
    selectedSymptoms: 'ਚੁਣੇ ਗਏ ਲੱਛਣ',
    noSymptomsSelected: 'ਅਜੇ ਤੱਕ ਕੋਈ ਲੱਛਣ ਨਹੀਂ ਚੁਣਿਆ ਗਿਆ।',
    clearAll: 'ਸਭ ਸਾਫ਼ ਕਰੋ',
    getDiagnosis: 'ਨਿਦਾਨ ਪ੍ਰਾਪਤ ਕਰੋ',
    analyzingSymptoms: 'ਲੱਛਣਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਹੇ ਹਾਂ...',
    selectAtLeastOne: 'ਕਿਰਪਾ ਕਰਕੇ ਘੱਟੋ ਘੱਟ ਇੱਕ ਲੱਛਣ ਚੁਣੋ।',
    diagnosisFailed: 'ਨਿਦਾਨ ਪ੍ਰਾਪਤ ਕਰਨ ਵਿੱਚ ਅਸਫਲ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
    
    // Symptoms
    headache: 'ਸਿਰ ਦਰਦ',
    fever: 'ਬੁਖਾਰ',
    cough: 'ਖੰਘ',
    fatigue: 'ਥਕਾਵਟ',
    nausea: 'ਜੀ ਮਿਚਲਾਉਣਾ',
    soreThroat: 'ਗਲੇ ਵਿੱਚ ਖਰਾਸ਼',
    shortnessBreath: 'ਸਾਹ ਦੀ ਤਕਲੀਫ',
    chestPain: 'ਛਾਤੀ ਵਿੱਚ ਦਰਦ',
    diarrhea: 'ਦਸਤ',
    dizziness: 'ਚੱਕਰ ਆਉਣਾ',
    lossSmell: 'ਸੁਗੰਧ ਦੀ ਹਾਨੀ',
    lossTaste: 'ਸਵਾਦ ਦੀ ਹਾਨੀ',
    runnyNose: 'ਨੱਕ ਵਗਣਾ',
    sneezing: 'ਛਿੱਕਣਾ',
    musclePain: 'ਮਾਸਪੇਸ਼ੀਆਂ ਵਿੱਚ ਦਰਦ',
    backPain: 'ਪਿੱਠ ਦਰਦ'
  },
  
  or: {
    // Navbar
    brand: 'ଆରୋଗ୍ୟ AI',
    about: 'ବିଷୟରେ',
    login: 'ଲଗଇନ୍',
    register: 'ରେଜିଷ୍ଟର',
    logout: 'ଲଗଆଉଟ୍',
    
    // Services
    healthcareBot: 'ସ୍ୱାସ୍ଥ୍ୟ ଚାଟବଟ୍',
    healthcareBotDesc: '24/7 AI-ଚାଳିତ ଚିକିତ୍ସା ସହାୟତା',
    doctorPreference: 'ଡାକ୍ତର ପସନ୍ଦ (ଅନଲାଇନ୍)',
    doctorPreferenceDesc: 'ଆପଣଙ୍କର ପସନ୍ଦର ଅନଲାଇନ୍ ଡାକ୍ତର ବାଛନ୍ତୁ',
    medicineRecognition: 'ଔଷଧ ଚିହ୍ନଟ',
    medicineRecognitionDesc: 'ଔଷଧଗୁଡ଼ିକୁ ତୁରନ୍ତ ଚିହ୍ନଟ କରନ୍ତୁ',
    eqAssessment: 'EQ ମୂଲ୍ୟାଙ୍କନ',
    eqAssessmentDesc: 'ଭାବନାତ୍ମକ ବୁଦ୍ଧିମତ୍ତାର ମୂଲ୍ୟାଙ୍କନ କରନ୍ତୁ',
    whatsappServices: 'ହ୍ୱାଟସଆପ୍ ସେବା',
    whatsappServicesDesc: 'ତୁରନ୍ତ ସହାୟତା ପାଇଁ ହ୍ୱାଟସଆପ୍ ମାଧ୍ୟମରେ ସଂଯୋଗ କରନ୍ତୁ',
    
    // Home Page
    heroTitle: 'ସ୍ୱାସ୍ଥ୍ୟ AI ଲିଙ୍କଡ୍ ଅପରେସନ୍ସ',
    heroDesc: 'ଆପଣଙ୍କ ଆଙ୍ଗୁଳି ଟିପରେ AI-ଚାଳିତ ଚିକିତ୍ସା ସମାଧାନର ଅନୁଭବ କରନ୍ତୁ।',
    healthOverview: 'ଆପଣଙ୍କର ସ୍ୱାସ୍ଥ୍ୟ ସମୀକ୍ଷା',
    weight: 'ଓଜନ',
    height: 'ଉଚ୍ଚତା',
    bloodType: 'ରକ୍ତ ପ୍ରକାର',
    recentHistory: 'ସାମ୍ପ୍ରତିକ ଚିକିତ୍ସା ଇତିହାସ',
    healthMetrics: 'ସ୍ୱାସ୍ଥ୍ୟ ମେଟ୍ରିକ୍ସ',
    lastCheckup: 'ଶେଷ ଯାଞ୍ଚ',
    vaccination: 'ଟିକାକରଣ',
    
    // Connection Status
    serverConnection: 'ସର୍ଭର ସଂଯୋଗ ସ୍ଥିତି',
    connected: 'ସର୍ଭର ସହିତ ସଂଯୁକ୍ତ',
    connectionFailed: 'ସଂଯୋଗ ବିଫଳ',
    testConnection: 'ସଂଯୋଗ ପରୀକ୍ଷା',
    
    // Service Descriptions
    healthcareBotLongDesc: 'ଆମର AI-ଚାଳିତ ଚାଟବଟ୍ ତୁରନ୍ତ ଚିକିତ୍ସା ମାର୍ଗଦର୍ଶନ, ଲକ୍ଷଣ ବିଶ୍ଳେଷଣ ଏବଂ ସ୍ୱାସ୍ଥ୍ୟ ସୁପାରିଶ ପ୍ରଦାନ କରେ। 24/7 ଉପଲବ୍ଧ, ଏହା ସମ୍ପୂର୍ଣ୍ଣ ଗୋପନୀୟତା ବଜାୟ ରଖି ବିଶ୍ୱସ୍ତ ପ୍ରାଥମିକ ଚିକିତ୍ସା ପରାମର୍ଶ ପ୍ରଦାନ କରେ।',
    medicineRecognitionLongDesc: 'ଉନ୍ନତ ଔଷଧ ଚିହ୍ନଟ ସିଷ୍ଟମ ଯାହା ଆପଣଙ୍କୁ ଔଷଧଗୁଡ଼ିକୁ ଚିହ୍ନଟ କରିବାରେ, ସେମାନଙ୍କର ବ୍ୟବହାର, ଉପଯୁକ୍ତ ମାତ୍ରା ଏବଂ ସମ୍ଭାବ୍ୟ ପାର୍ଶ୍ୱ ପ୍ରଭାବ ବୁଝିବାରେ ସାହାଯ୍ୟ କରେ। ତୁରନ୍ତ ସୂଚନା ପାଇଁ କେବଳ ଆପଣଙ୍କ ଔଷଧର ଏକ ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ।',
    eqAssessmentLongDesc: 'ବୃତ୍ତିଗତ ଭାବନାତ୍ମକ ବୁଦ୍ଧିମତ୍ତା ମୂଲ୍ୟାଙ୍କନ ଉପକରଣ ଯାହା ଆପଣଙ୍କର ଭାବନାତ୍ମକ ସଚେତନତା, ସହାନୁଭୂତି ଏବଂ ସାମାଜିକ କୌଶଳର ମୂଲ୍ୟାଙ୍କନ ଏବଂ ଉନ୍ନତି କରିବାରେ ସାହାଯ୍ୟ କରେ। ବ୍ୟକ୍ତିଗତ ଅନ୍ତର୍ଦୃଷ୍ଟି ଏବଂ ବିକାଶ ସୁପାରିଶ ପାଆନ୍ତୁ।',
    whatsappServicesLongDesc: 'ହ୍ୱାଟସଆପ୍ ମାଧ୍ୟମରେ ଆମର ସ୍ୱାସ୍ଥ୍ୟ ସହାୟତା ଦଳ ସହିତ ତୁରନ୍ତ ସଂଯୋଗ କରନ୍ତୁ। ଆପଣଙ୍କର ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରଶ୍ନର ଶୀଘ୍ର ଉତ୍ତର ପାଆନ୍ତୁ, ନିଯୁକ୍ତି ନିର୍ଧାରଣ କରନ୍ତୁ, ଔଷଧ ସ୍ମାରକ ପାଆନ୍ତୁ, ଏବଂ ଆପଣଙ୍କର ପ୍ରିୟ ମେସେଜିଂ ପ୍ଲାଟଫର୍ମ ମାଧ୍ୟମରେ ଜରୁରୀକାଳୀନ ସହାୟତା ପାଆନ୍ତୁ।',
    
    // Medical History
    regularCheckup: 'ନିୟମିତ ସ୍ୱାସ୍ଥ୍ୟ ପରୀକ୍ଷା ସମ୍ପୂର୍ଣ୍ଣ',
    fluShot: 'ବାର୍ଷିକ ଫ୍ଲୁ ଟିକା ଦିଆଗଲା',
    weeksAgo: 'ସପ୍ତାହ ପୂର୍ବେ',
    monthAgo: 'ମାସ ପୂର୍ବେ',
    normal: 'ସାଧାରଣ',
    
    // Chatbot
    symptomAI: 'ଲକ୍ଷଣ AI',
    contactDoctor: 'ଡାକ୍ତରଙ୍କ ସହିତ ଯୋଗାଯୋଗ କରନ୍ତୁ',
    enterSymptoms: 'ଆପଣଙ୍କର ଲକ୍ଷଣ ପ୍ରବେଶ କରନ୍ତୁ',
    typeSymptom: 'ଏକ ଲକ୍ଷଣ ଟାଇପ୍ କରନ୍ତୁ (ଯେପରି ମୁଣ୍ଡବିନ୍ଧା)',
    addSymptom: 'ଲକ୍ଷଣ ଯୋଗ କରନ୍ତୁ',
    commonSymptoms: 'ସାଧାରଣ ଲକ୍ଷଣ',
    selectedSymptoms: 'ମନୋନୀତ ଲକ୍ଷଣ',
    noSymptomsSelected: 'ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଲକ୍ଷଣ ମନୋନୀତ ହୋଇନାହିଁ।',
    clearAll: 'ସବୁ ସଫା କରନ୍ତୁ',
    getDiagnosis: 'ନିଦାନ ପାଆନ୍ତୁ',
    analyzingSymptoms: 'ଲକ୍ଷଣଗୁଡ଼ିକର ବିଶ୍ଳେଷଣ କରୁଛି...',
    selectAtLeastOne: 'ଦୟାକରି ଅତି କମରେ ଗୋଟିଏ ଲକ୍ଷଣ ବାଛନ୍ତୁ।',
    diagnosisFailed: 'ନିଦାନ ପାଇବାରେ ବିଫଳ। ଦୟାକରି ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ।',
    
    // Symptoms
    headache: 'ମୁଣ୍ଡବିନ୍ଧା',
    fever: 'ଜ୍ୱର',
    cough: 'କାଶ',
    fatigue: 'କ୍ଳାନ୍ତି',
    nausea: 'ବାନ୍ତି ଲାଗିବା',
    soreThroat: 'ଗଳା ଯନ୍ତ୍ରଣା',
    shortnessBreath: 'ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ',
    chestPain: 'ଛାତି ଯନ୍ତ୍ରଣା',
    diarrhea: 'ଡାଇରିଆ',
    dizziness: 'ମୁଣ୍ଡ ଘୂରିବା',
    lossSmell: 'ଗନ୍ଧ ହରାଇବା',
    lossTaste: 'ସ୍ୱାଦ ହରାଇବା',
    runnyNose: 'ନାକ ବହିବା',
    sneezing: 'ଛିଙ୍କିବା',
    musclePain: 'ମାଂସପେଶୀ ଯନ୍ତ୍ରଣା',
    backPain: 'ପିଠି ଯନ୍ତ୍ରଣା'
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('selectedLanguage') || 'en';
  });

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('selectedLanguage', languageCode);
  };

  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
