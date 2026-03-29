import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain, faPlay, faCheck, faChartBar } from '@fortawesome/free-solid-svg-icons';

const EQTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [results, setResults] = useState(null);

  const questions = [
    {
      id: 1,
      question: "I can easily recognize my own emotions as they occur.",
      category: "Self-Awareness"
    },
    {
      id: 2,
      question: "I can stay calm under pressure.",
      category: "Self-Regulation"
    },
    {
      id: 3,
      question: "I am motivated to achieve my goals even when facing obstacles.",
      category: "Motivation"
    },
    {
      id: 4,
      question: "I can easily understand how others are feeling.",
      category: "Empathy"
    },
    {
      id: 5,
      question: "I am good at managing relationships and building rapport.",
      category: "Social Skills"
    },
    {
      id: 6,
      question: "I understand what triggers my emotions.",
      category: "Self-Awareness"
    },
    {
      id: 7,
      question: "I can control my impulses effectively.",
      category: "Self-Regulation"
    },
    {
      id: 8,
      question: "I remain optimistic even during difficult times.",
      category: "Motivation"
    },
    {
      id: 9,
      question: "I can sense when someone needs emotional support.",
      category: "Empathy"
    },
    {
      id: 10,
      question: "I handle conflicts well and find win-win solutions.",
      category: "Social Skills"
    }
  ];

  const scaleOptions = [
    { value: 1, label: "Strongly Disagree" },
    { value: 2, label: "Disagree" },
    { value: 3, label: "Neutral" },
    { value: 4, label: "Agree" },
    { value: 5, label: "Strongly Agree" }
  ];

  const startTest = () => {
    setTestStarted(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setTestCompleted(false);
    setResults(null);
  };

  const handleAnswer = (value) => {
    const newAnswers = [...answers, { questionId: questions[currentQuestion].id, value, category: questions[currentQuestion].category }];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (allAnswers) => {
    const categories = {
      "Self-Awareness": [],
      "Self-Regulation": [],
      "Motivation": [],
      "Empathy": [],
      "Social Skills": []
    };

    allAnswers.forEach(answer => {
      categories[answer.category].push(answer.value);
    });

    const categoryScores = {};
    let totalScore = 0;

    Object.keys(categories).forEach(category => {
      const scores = categories[category];
      const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      categoryScores[category] = Math.round(average * 20); // Convert to percentage
      totalScore += average;
    });

    const overallScore = Math.round((totalScore / 5) * 20);

    let interpretation = "";
    if (overallScore >= 80) {
      interpretation = "Excellent emotional intelligence! You have strong self-awareness and social skills.";
    } else if (overallScore >= 60) {
      interpretation = "Good emotional intelligence with room for improvement in some areas.";
    } else if (overallScore >= 40) {
      interpretation = "Average emotional intelligence. Consider developing your emotional skills further.";
    } else {
      interpretation = "There's significant room for improvement in emotional intelligence skills.";
    }

    setResults({
      overall: overallScore,
      categories: categoryScores,
      interpretation
    });
    setTestCompleted(true);
  };

  const resetTest = () => {
    setTestStarted(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setTestCompleted(false);
    setResults(null);
  };

  if (!testStarted) {
    return (
      <div className="main-container">
        <div className="content" style={{ gridColumn: '1 / -1' }}>
          <div className="hero-section">
            <h2>
              <FontAwesomeIcon icon={faBrain} /> Emotional Intelligence Assessment
            </h2>
            <p>Evaluate your emotional intelligence and get personalized insights</p>
          </div>

          <div className="service-descriptions">
            <div className="service-description">
              <h3>About the EQ Test</h3>
              <p>
                This assessment evaluates five key areas of emotional intelligence:
              </p>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
                <li><strong>Self-Awareness:</strong> Understanding your own emotions</li>
                <li><strong>Self-Regulation:</strong> Managing your emotional responses</li>
                <li><strong>Motivation:</strong> Using emotions to achieve goals</li>
                <li><strong>Empathy:</strong> Understanding others' emotions</li>
                <li><strong>Social Skills:</strong> Managing relationships effectively</li>
              </ul>
            </div>

            <div className="service-description">
              <h3>Test Instructions</h3>
              <div style={{ marginBottom: '1.5rem' }}>
                <p>• The test consists of 10 questions</p>
                <p>• Rate each statement from 1 (Strongly Disagree) to 5 (Strongly Agree)</p>
                <p>• Answer honestly for the most accurate results</p>
                <p>• The test takes approximately 5 minutes to complete</p>
              </div>
              
              <button 
                className="btn-primary"
                onClick={startTest}
                style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
              >
                <FontAwesomeIcon icon={faPlay} /> Start EQ Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (testCompleted && results) {
    return (
      <div className="main-container">
        <div className="content" style={{ gridColumn: '1 / -1' }}>
          <div className="hero-section">
            <h2>
              <FontAwesomeIcon icon={faChartBar} /> Your EQ Assessment Results
            </h2>
            <p>Here's your emotional intelligence profile</p>
          </div>

          <div className="service-descriptions">
            <div className="service-description">
              <h3>Overall EQ Score</h3>
              <div style={{ 
                textAlign: 'center', 
                background: 'var(--light)', 
                padding: '2rem', 
                borderRadius: '12px',
                marginBottom: '1rem'
              }}>
                <div style={{ 
                  fontSize: '3rem', 
                  fontWeight: 'bold', 
                  color: 'var(--primary)',
                  marginBottom: '0.5rem'
                }}>
                  {results.overall}%
                </div>
                <p style={{ fontSize: '1.1rem', margin: 0 }}>{results.interpretation}</p>
              </div>
            </div>

            <div className="service-description">
              <h3>Category Breakdown</h3>
              {Object.entries(results.categories).map(([category, score]) => (
                <div key={category} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '600' }}>{category}</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{score}%</span>
                  </div>
                  <div style={{ 
                    background: 'var(--border)', 
                    height: '8px', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      background: score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444',
                      height: '100%',
                      width: `${score}%`,
                      borderRadius: '4px',
                      transition: 'width 1s ease-out'
                    }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="service-description">
              <h3>Recommendations</h3>
              <div style={{ background: 'var(--light)', padding: '1.5rem', borderRadius: '8px' }}>
                <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Areas for Development:</h4>
                <ul>
                  {Object.entries(results.categories)
                    .filter(([_, score]) => score < 70)
                    .map(([category, score]) => (
                      <li key={category}>
                        <strong>{category}:</strong> Consider practicing mindfulness and self-reflection techniques
                      </li>
                    ))}
                </ul>
                {Object.values(results.categories).every(score => score >= 70) && (
                  <p>Excellent work! Continue to practice and refine your emotional intelligence skills.</p>
                )}
              </div>
              
              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <button 
                  className="btn-primary"
                  onClick={resetTest}
                >
                  Take Test Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="content" style={{ gridColumn: '1 / -1' }}>
        <div className="hero-section">
          <h2>
            <FontAwesomeIcon icon={faBrain} /> EQ Assessment
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p>Question {currentQuestion + 1} of {questions.length}</p>
            <div style={{ 
              background: 'var(--primary)', 
              color: 'white', 
              padding: '0.5rem 1rem', 
              borderRadius: '20px',
              fontSize: '0.9rem'
            }}>
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
            </div>
          </div>
        </div>

        <div className="service-descriptions">
          <div className="service-description">
            <h3 style={{ marginBottom: '1.5rem' }}>
              {questions[currentQuestion].question}
            </h3>
            
            <div style={{ 
              background: 'var(--light)', 
              padding: '0.5rem', 
              borderRadius: '8px', 
              marginBottom: '2rem',
              fontSize: '0.9rem',
              textAlign: 'center'
            }}>
              Category: <strong>{questions[currentQuestion].category}</strong>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {scaleOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  style={{
                    padding: '1rem',
                    border: '2px solid var(--border)',
                    borderRadius: '8px',
                    background: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'left',
                    fontSize: '1rem'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.borderColor = 'var(--primary)';
                    e.target.style.background = 'var(--light)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.background = 'white';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ 
                      width: '30px', 
                      height: '30px', 
                      borderRadius: '50%', 
                      background: 'var(--primary)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold'
                    }}>
                      {option.value}
                    </div>
                    <span>{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EQTest;
