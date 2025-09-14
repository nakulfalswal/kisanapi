import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Droplets, 
  Zap, 
  Brain, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Edit3,
  Save,
  X
} from 'lucide-react';
import './CropCard.css';

const CropCard = ({ crop, getHealthColor, getMLRecommendation, updateCropSoilData }) => {
  const [mlRecommendation, setMLRecommendation] = useState(null);
  const [isEditingSoil, setIsEditingSoil] = useState(false);
  const [soilData, setSoilData] = useState(crop.soilData || {
    N: 60, P: 30, K: 30, temperature: 25, humidity: 60, ph: 6.5, rainfall: 150
  });

  useEffect(() => {
    if (crop.soilData) {
      getMLRecommendation(crop).then(setMLRecommendation);
    }
  }, [crop, getMLRecommendation]);

  const handleSaveSoilData = () => {
    updateCropSoilData(crop.id, soilData);
    setIsEditingSoil(false);
    // Refresh ML recommendation
    getMLRecommendation({ ...crop, soilData }).then(setMLRecommendation);
  };

  const getSuitabilityColor = (confidence) => {
    if (confidence >= 80) return '#4CAF50';
    if (confidence >= 60) return '#FFC107';
    return '#FF5722';
  };

  const getSuitabilityText = (confidence) => {
    if (confidence >= 80) return 'Excellent';
    if (confidence >= 60) return 'Good';
    if (confidence >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="crop-card">
      <div className="crop-header">
        <h4>{crop.name}</h4>
        <div className="crop-status" style={{color: getHealthColor(crop.health)}}>
          {crop.health}
        </div>
      </div>

      <div className="crop-details">
        <div className="detail-item">
          <Calendar size={16} />
          <span>Planted: {crop.plantingDate}</span>
        </div>
        <div className="detail-item">
          <Clock size={16} />
          <span>Harvest: {crop.expectedHarvest}</span>
        </div>
        <div className="detail-item">
          <Droplets size={16} />
          <span>Water: {crop.waterRequirement}</span>
        </div>
        <div className="detail-item">
          <Zap size={16} />
          <span>Fertilizer: {crop.fertilizerType}</span>
        </div>
      </div>

      {/* ML Recommendation Section */}
      {mlRecommendation && (
        <div className="ml-recommendation">
          <div className="ml-header">
            <Brain size={16} />
            <span>AI Analysis</span>
          </div>
          <div className="ml-content">
            <div className="suitability-score">
              <span className="score-label">Suitability:</span>
              <span 
                className="score-value"
                style={{color: getSuitabilityColor(mlRecommendation.top_predictions[0]?.probability || 0)}}
              >
                {getSuitabilityText(mlRecommendation.top_predictions[0]?.probability || 0)} 
                ({mlRecommendation.top_predictions[0]?.probability || 0}%)
              </span>
            </div>
            
            {mlRecommendation.recommended_crop.toLowerCase() !== crop.name.toLowerCase() && (
              <div className="crop-mismatch">
                <AlertTriangle size={14} />
                <span>ML recommends: <strong>{mlRecommendation.recommended_crop}</strong></span>
              </div>
            )}
            
            <div className="top-recommendations">
              <span className="recommendations-label">Top 3 Recommendations:</span>
              <div className="recommendations-list">
                {mlRecommendation.top_predictions.map((pred, index) => (
                  <div key={index} className="recommendation-item">
                    <span className="crop-name">{pred.crop}</span>
                    <span className="confidence">{pred.probability}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Soil Data Section */}
      <div className="soil-data-section">
        <div className="soil-header">
          <span>Soil Parameters</span>
          <button 
            className="edit-soil-btn"
            onClick={() => setIsEditingSoil(!isEditingSoil)}
          >
            {isEditingSoil ? <X size={14} /> : <Edit3 size={14} />}
          </button>
        </div>
        
        {isEditingSoil ? (
          <div className="soil-edit-form">
            <div className="soil-inputs">
              <div className="soil-input">
                <label>N (kg/ha):</label>
                <input
                  type="number"
                  value={soilData.N}
                  onChange={(e) => setSoilData({...soilData, N: parseFloat(e.target.value)})}
                />
              </div>
              <div className="soil-input">
                <label>P (kg/ha):</label>
                <input
                  type="number"
                  value={soilData.P}
                  onChange={(e) => setSoilData({...soilData, P: parseFloat(e.target.value)})}
                />
              </div>
              <div className="soil-input">
                <label>K (kg/ha):</label>
                <input
                  type="number"
                  value={soilData.K}
                  onChange={(e) => setSoilData({...soilData, K: parseFloat(e.target.value)})}
                />
              </div>
              <div className="soil-input">
                <label>Temp (°C):</label>
                <input
                  type="number"
                  value={soilData.temperature}
                  onChange={(e) => setSoilData({...soilData, temperature: parseFloat(e.target.value)})}
                />
              </div>
              <div className="soil-input">
                <label>Humidity (%):</label>
                <input
                  type="number"
                  value={soilData.humidity}
                  onChange={(e) => setSoilData({...soilData, humidity: parseFloat(e.target.value)})}
                />
              </div>
              <div className="soil-input">
                <label>pH:</label>
                <input
                  type="number"
                  step="0.1"
                  value={soilData.ph}
                  onChange={(e) => setSoilData({...soilData, ph: parseFloat(e.target.value)})}
                />
              </div>
              <div className="soil-input">
                <label>Rainfall (mm):</label>
                <input
                  type="number"
                  value={soilData.rainfall}
                  onChange={(e) => setSoilData({...soilData, rainfall: parseFloat(e.target.value)})}
                />
              </div>
            </div>
            <button className="save-soil-btn" onClick={handleSaveSoilData}>
              <Save size={14} />
              Update & Analyze
            </button>
          </div>
        ) : (
          <div className="soil-display">
            <div className="soil-param">
              <span>N:</span> <span>{soilData.N} kg/ha</span>
            </div>
            <div className="soil-param">
              <span>P:</span> <span>{soilData.P} kg/ha</span>
            </div>
            <div className="soil-param">
              <span>K:</span> <span>{soilData.K} kg/ha</span>
            </div>
            <div className="soil-param">
              <span>Temp:</span> <span>{soilData.temperature}°C</span>
            </div>
            <div className="soil-param">
              <span>Humidity:</span> <span>{soilData.humidity}%</span>
            </div>
            <div className="soil-param">
              <span>pH:</span> <span>{soilData.ph}</span>
            </div>
            <div className="soil-param">
              <span>Rainfall:</span> <span>{soilData.rainfall}mm</span>
            </div>
          </div>
        )}
      </div>

      {crop.notes && (
        <div className="crop-notes">
          <p>{crop.notes}</p>
        </div>
      )}
    </div>
  );
};

export default CropCard;
