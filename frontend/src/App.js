import React, { useState } from 'react';
import './App.css';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import InputForm from './components/InputForm';
import Results from './components/Results';
import Footer from './components/Footer';
import KnowledgeSidebar from './components/KnowledgeSidebar';
import Chatbot from './components/Chatbot';
import CropManagementButton from './components/CropManagementButton';
import CropDashboard from './pages/CropDashboard';

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCropDashboard, setShowCropDashboard] = useState(false);

  const handlePrediction = async (formData) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get prediction');
      }

      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
  };

  const handleOpenCropDashboard = () => {
    setShowCropDashboard(true);
  };

  const handleBackToMain = () => {
    setShowCropDashboard(false);
  };

  if (showCropDashboard) {
    return (
      <LanguageProvider>
        <CropDashboard onBack={handleBackToMain} />
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <div className="App">
        <KnowledgeSidebar />
        <Header onOpenCropDashboard={handleOpenCropDashboard} />
        <main className="main-content">
          <div className="container">
            <div className="content-wrapper">
              <div className="form-section">
                <InputForm 
                  onPrediction={handlePrediction} 
                  loading={loading}
                  onReset={handleReset}
                />
              </div>
              <div className="results-section">
                <Results 
                  results={results} 
                  loading={loading} 
                  error={error}
                />
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <Chatbot onRecommendation={handlePrediction} />
        <CropManagementButton />
      </div>
    </LanguageProvider>
  );
}

export default App;
