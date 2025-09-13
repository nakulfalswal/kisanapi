import React, { useState } from 'react';
import { Send, RotateCcw, Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';
import './InputForm.css';

const InputForm = ({ onPrediction, loading, onReset }) => {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  
  const [formData, setFormData] = useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
    location: ''
  });

  const [showInfo, setShowInfo] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const values = Object.values(formData);
    if (values.some(value => value === '')) {
      alert('Please fill in all fields');
      return;
    }

    // Convert to numbers
    const numericData = {};
    Object.keys(formData).forEach(key => {
      numericData[key] = parseFloat(formData[key]);
    });

    onPrediction(numericData);
  };

  const handleReset = () => {
    setFormData({
      N: '',
      P: '',
      K: '',
      temperature: '',
      humidity: '',
      ph: '',
      rainfall: '',
      location: ''
    });
    onReset();
  };

  const inputFields = [
    {
      name: 'N',
      label: t.nitrogen,
      unit: 'kg/ha',
      description: 'Amount of nitrogen in soil',
      min: 0,
      max: 200,
      step: 1
    },
    {
      name: 'P',
      label: t.phosphorus,
      unit: 'kg/ha',
      description: 'Amount of phosphorus in soil',
      min: 0,
      max: 200,
      step: 1
    },
    {
      name: 'K',
      label: t.potassium,
      unit: 'kg/ha',
      description: 'Amount of potassium in soil',
      min: 0,
      max: 200,
      step: 1
    },
    {
      name: 'temperature',
      label: t.temperature,
      unit: '°C',
      description: 'Average temperature',
      min: 0,
      max: 50,
      step: 0.1
    },
    {
      name: 'humidity',
      label: t.humidity,
      unit: '%',
      description: 'Relative humidity',
      min: 0,
      max: 100,
      step: 1
    },
    {
      name: 'ph',
      label: t.phLevel,
      unit: '',
      description: 'Soil pH level',
      min: 0,
      max: 14,
      step: 0.1
    },
    {
      name: 'rainfall',
      label: t.rainfall,
      unit: 'mm',
      description: 'Annual rainfall',
      min: 0,
      max: 500,
      step: 1
    },
    {
      name: 'location',
      label: t.location,
      unit: '',
      description: 'Your region/state for better recommendations',
      type: 'text'
    }
  ];

  return (
    <div className="input-form">
      <div className="form-header">
        <h2>{t.soilClimateParams}</h2>
        <button 
          className="info-button"
          onClick={() => setShowInfo(!showInfo)}
          title="Parameter Information"
        >
          <Info size={20} />
        </button>
      </div>

      {showInfo && (
        <div className="info-panel">
          <h3>{t.parameterGuidelines}</h3>
          <ul>
            <li><strong>N, P, K:</strong> {t.nPKDescription}</li>
            <li><strong>{t.temperature}:</strong> {t.temperatureDescription}</li>
            <li><strong>{t.humidity}:</strong> {t.humidityDescription}</li>
            <li><strong>pH:</strong> {t.phDescription}</li>
            <li><strong>{t.rainfall}:</strong> {t.rainfallDescription}</li>
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-grid">
          {inputFields.map(field => (
            <div key={field.name} className="input-group">
              <label htmlFor={field.name} className="input-label">
                {field.label}
                <span className="unit">({field.unit})</span>
              </label>
              <input
                type={field.type || "number"}
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleInputChange}
                min={field.min}
                max={field.max}
                step={field.step}
                className="input-field"
                placeholder={`Enter ${field.label.toLowerCase()}`}
                title={field.description}
              />
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handleReset}
            className="reset-button"
            disabled={loading}
          >
            <RotateCcw size={18} />
            {t.reset}
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                {t.analyzing}
              </>
            ) : (
              <>
                <Send size={18} />
                {t.getRecommendation}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
