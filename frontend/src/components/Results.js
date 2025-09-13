import React from 'react';
import { CheckCircle, AlertCircle, Loader, TrendingUp, Leaf, Droplets, Sun, Thermometer } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';
import './Results.css';

const Results = ({ results, loading, error }) => {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  if (loading) {
    return (
      <div className="results">
        <div className="results-header">
          <h2>{t.analysisResults}</h2>
        </div>
        <div className="loading-state">
          <Loader className="loading-spinner" />
          <p>{t.analyzing}</p>
          <p className="loading-subtitle">Our AI model is processing your parameters</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results">
        <div className="results-header">
          <h2>{t.analysisResults}</h2>
        </div>
        <div className="error-state">
          <AlertCircle className="error-icon" />
          <h3>Analysis Failed</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="results">
        <div className="results-header">
          <h2>{t.analysisResults}</h2>
        </div>
        <div className="empty-state">
          <Leaf className="empty-icon" />
          <h3>{t.readyForAnalysis}</h3>
          <p>{t.enterParameters}</p>
        </div>
      </div>
    );
  }

  const { prediction, input_parameters } = results;
  const { recommended_crop, top_predictions } = prediction;

  const getCropIcon = (crop) => {
    const cropIcons = {
      rice: '🌾',
      maize: '🌽',
      chickpea: '🫘',
      kidneybeans: '🫘',
      pigeonpeas: '🫘',
      mothbeans: '🫘',
      mungbean: '🫘',
      blackgram: '🫘',
      lentil: '🫘',
      pomegranate: '🍎',
      banana: '🍌',
      mango: '🥭',
      grapes: '🍇',
      watermelon: '🍉',
      muskmelon: '🍈',
      apple: '🍎',
      orange: '🍊',
      papaya: '🥭',
      coconut: '🥥',
      cotton: '🌿',
      jute: '🌿',
      coffee: '☕'
    };
    return cropIcons[crop] || '🌱';
  };

  const getCropDescription = (crop) => {
    const descriptions = {
      rice: 'Staple food crop requiring high water and nitrogen',
      maize: 'Cereal crop with high yield potential',
      chickpea: 'Protein-rich legume crop',
      kidneybeans: 'Nutritious legume with high protein content',
      pigeonpeas: 'Drought-resistant legume crop',
      mothbeans: 'Small-seeded legume crop',
      mungbean: 'Fast-growing legume crop',
      blackgram: 'Protein-rich pulse crop',
      lentil: 'Nutritious pulse crop',
      pomegranate: 'Antioxidant-rich fruit crop',
      banana: 'Tropical fruit crop with high potassium',
      mango: 'Tropical fruit tree with sweet fruits',
      grapes: 'Vine fruit crop for fresh consumption and wine',
      watermelon: 'Summer fruit crop with high water content',
      muskmelon: 'Sweet melon crop for summer cultivation',
      apple: 'Temperate fruit tree with crisp fruits',
      orange: 'Citrus fruit tree with vitamin C rich fruits',
      papaya: 'Tropical fruit tree with digestive enzymes',
      coconut: 'Tropical palm tree with versatile uses',
      cotton: 'Fiber crop for textile industry',
      jute: 'Natural fiber crop for packaging',
      coffee: 'Beverage crop with stimulating properties'
    };
    return descriptions[crop] || 'Agricultural crop suitable for your conditions';
  };

  return (
    <div className="results fade-in">
      <div className="results-header">
        <h2>{t.analysisResults}</h2>
        <div className="success-indicator">
          <CheckCircle className="success-icon" />
          <span>{t.analysisComplete}</span>
        </div>
      </div>

      <div className="results-content">
        {/* Primary Recommendation */}
        <div className="primary-recommendation">
          <div className="recommendation-header">
            <div className="crop-icon">
              {getCropIcon(recommended_crop)}
            </div>
            <div className="crop-info">
              <h3 className="crop-name">
                {recommended_crop.charAt(0).toUpperCase() + recommended_crop.slice(1)}
              </h3>
              <p className="crop-description">
                {getCropDescription(recommended_crop)}
              </p>
            </div>
          </div>
          <div className="confidence-badge">
            <TrendingUp className="trending-icon" />
            <span>{t.bestMatch}</span>
          </div>
        </div>

        {/* Alternative Recommendations */}
        <div className="alternative-recommendations">
          <h4>{t.alternativeOptions}</h4>
          <div className="alternatives-grid">
            {top_predictions.slice(1).map((alt, index) => (
              <div key={index} className="alternative-item">
                <div className="alt-crop-icon">
                  {getCropIcon(alt.crop)}
                </div>
                <div className="alt-crop-info">
                  <span className="alt-crop-name">
                    {alt.crop.charAt(0).toUpperCase() + alt.crop.slice(1)}
                  </span>
                  <span className="alt-confidence">
                    {alt.probability}% {t.match}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Parameters Summary */}
        <div className="parameters-summary">
          <h4>{t.yourParameters}</h4>
          <div className="parameters-grid">
            <div className="parameter-item">
              <Thermometer className="param-icon" />
              <div className="param-info">
                <span className="param-label">Temperature</span>
                <span className="param-value">{input_parameters.temperature}°C</span>
              </div>
            </div>
            <div className="parameter-item">
              <Droplets className="param-icon" />
              <div className="param-info">
                <span className="param-label">Humidity</span>
                <span className="param-value">{input_parameters.humidity}%</span>
              </div>
            </div>
            <div className="parameter-item">
              <Sun className="param-icon" />
              <div className="param-info">
                <span className="param-label">Rainfall</span>
                <span className="param-value">{input_parameters.rainfall}mm</span>
              </div>
            </div>
            <div className="parameter-item">
              <Leaf className="param-icon" />
              <div className="param-info">
                <span className="param-label">pH Level</span>
                <span className="param-value">{input_parameters.ph}</span>
              </div>
            </div>
            {input_parameters.location && (
              <div className="parameter-item">
                <Sun className="param-icon" />
                <div className="param-info">
                  <span className="param-label">Location</span>
                  <span className="param-value">{input_parameters.location}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
