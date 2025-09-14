import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Droplets, 
  Sun, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Leaf,
  Zap,
  Clock,
  MapPin
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';
import './CropManagement.css';

const CropManagement = ({ isOpen, onClose, userData }) => {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [crops, setCrops] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [newCrop, setNewCrop] = useState({
    name: '',
    plantingDate: '',
    expectedHarvest: '',
    waterRequirement: '',
    fertilizerType: '',
    notes: ''
  });

  // Load user's crop data and generate smart alerts
  useEffect(() => {
    if (isOpen) {
      // Load user's crop data from localStorage
      const savedCrops = localStorage.getItem('userCrops');
      if (savedCrops) {
        setCrops(JSON.parse(savedCrops));
      } else {
        // Default crops for demo
        const defaultCrops = [
          {
            id: 1,
            name: 'Rice',
            plantingDate: '2024-01-15',
            expectedHarvest: '2024-04-15',
            waterRequirement: 'High',
            fertilizerType: 'NPK 20-20-20',
            status: 'Growing',
            health: 'Good',
            soilData: { N: 80, P: 40, K: 40, temperature: 25, humidity: 80, ph: 6.5, rainfall: 200 }
          },
          {
            id: 2,
            name: 'Tomato',
            plantingDate: '2024-02-01',
            expectedHarvest: '2024-05-01',
            waterRequirement: 'Medium',
            fertilizerType: 'Organic Compost',
            status: 'Flowering',
            health: 'Excellent',
            soilData: { N: 60, P: 30, K: 30, temperature: 28, humidity: 60, ph: 6.0, rainfall: 150 }
          }
        ];
        setCrops(defaultCrops);
        localStorage.setItem('userCrops', JSON.stringify(defaultCrops));
      }

      // Generate smart alerts
      generateSmartAlerts();
    }
  }, [isOpen]);

  const generateSmartAlerts = async () => {
    const alerts = [];
    
    // Check each crop for potential issues
    for (const crop of crops) {
      if (crop.soilData) {
        try {
          // Get ML recommendation for this crop's soil data
          const response = await fetch('/api/predict', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(crop.soilData)
          });
          
          const data = await response.json();
          
          if (data.success) {
            const recommendedCrop = data.prediction.recommended_crop;
            const confidence = data.prediction.top_predictions[0]?.probability || 0;
            
            // Check if current crop matches recommendation
            if (recommendedCrop.toLowerCase() !== crop.name.toLowerCase()) {
              alerts.push({
                id: Date.now() + Math.random(),
                type: 'warning',
                title: 'Crop Mismatch Alert',
                message: `Your ${crop.name} may not be suitable for current soil conditions. ML recommends ${recommendedCrop} (${confidence}% confidence).`,
                date: new Date().toISOString().split('T')[0],
                priority: confidence > 70 ? 'high' : 'medium'
              });
            } else if (confidence < 60) {
              alerts.push({
                id: Date.now() + Math.random(),
                type: 'info',
                title: 'Low Confidence Alert',
                message: `Your ${crop.name} has low suitability (${confidence}%). Consider soil improvement.`,
                date: new Date().toISOString().split('T')[0],
                priority: 'medium'
              });
            }
          }
        } catch (error) {
          console.error('Error generating alert for crop:', crop.name, error);
        }
      }
    }
    
    // Add general farming alerts
    alerts.push({
      id: Date.now() + Math.random(),
      type: 'info',
      title: 'Fertilizer Reminder',
      message: 'Time to check soil nutrients and apply appropriate fertilizers.',
      date: new Date().toISOString().split('T')[0],
      priority: 'medium'
    });
    
    setAlerts(alerts);
  };

  const addCrop = async () => {
    if (newCrop.name && newCrop.plantingDate) {
      // Get ML recommendation for the new crop
      let soilData = null;
      let mlRecommendation = null;
      
      try {
        // Use default soil parameters for new crop (user can update later)
        const defaultSoilData = {
          N: 60, P: 30, K: 30, temperature: 25, humidity: 60, ph: 6.5, rainfall: 150
        };
        
        const response = await fetch('/api/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(defaultSoilData)
        });
        
        const data = await response.json();
        if (data.success) {
          mlRecommendation = data.prediction;
          soilData = defaultSoilData;
        }
      } catch (error) {
        console.error('Error getting ML recommendation:', error);
      }
      
      const crop = {
        id: Date.now(),
        ...newCrop,
        status: 'Planted',
        health: 'Good',
        soilData: soilData,
        mlRecommendation: mlRecommendation
      };
      
      const updatedCrops = [...crops, crop];
      setCrops(updatedCrops);
      localStorage.setItem('userCrops', JSON.stringify(updatedCrops));
      
      setNewCrop({
        name: '',
        plantingDate: '',
        expectedHarvest: '',
        waterRequirement: '',
        fertilizerType: '',
        notes: ''
      });
      
      // Regenerate alerts with new crop
      generateSmartAlerts();
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="alert-icon warning" />;
      case 'success': return <CheckCircle className="alert-icon success" />;
      case 'info': return <TrendingUp className="alert-icon info" />;
      default: return <Clock className="alert-icon" />;
    }
  };

  const getHealthColor = (health) => {
    switch (health) {
      case 'Excellent': return '#4CAF50';
      case 'Good': return '#8BC34A';
      case 'Fair': return '#FFC107';
      case 'Poor': return '#FF5722';
      default: return '#9E9E9E';
    }
  };

  return (
    <div className={`crop-management-overlay ${isOpen ? 'open' : ''}`}>
      <div className="crop-management-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Leaf size={24} />
            <h2>Crop Management System</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="panel-tabs">
          <button 
            className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <TrendingUp size={16} />
            Dashboard
          </button>
          <button 
            className={`tab ${activeTab === 'crops' ? 'active' : ''}`}
            onClick={() => setActiveTab('crops')}
          >
            <Leaf size={16} />
            My Crops
          </button>
          <button 
            className={`tab ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            <AlertTriangle size={16} />
            Alerts
          </button>
        </div>

        <div className="panel-content">
          {activeTab === 'dashboard' && (
            <div className="dashboard">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <Leaf size={24} />
                  </div>
                  <div className="stat-info">
                    <h3>{crops.length}</h3>
                    <p>Active Crops</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <AlertTriangle size={24} />
                  </div>
                  <div className="stat-info">
                    <h3>{alerts.filter(a => a.priority === 'high').length}</h3>
                    <p>High Priority Alerts</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <Droplets size={24} />
                  </div>
                  <div className="stat-info">
                    <h3>85%</h3>
                    <p>Water Efficiency</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <Sun size={24} />
                  </div>
                  <div className="stat-info">
                    <h3>Good</h3>
                    <p>Weather Condition</p>
                  </div>
                </div>
              </div>

              <div className="recent-activity">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  {alerts.slice(0, 3).map(alert => (
                    <div key={alert.id} className="activity-item">
                      {getAlertIcon(alert.type)}
                      <div className="activity-content">
                        <p>{alert.title}</p>
                        <span className="activity-date">{alert.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'crops' && (
            <div className="crops-section">
              <div className="add-crop-form">
                <h3>Add New Crop</h3>
                <div className="form-grid">
                  <input
                    type="text"
                    placeholder="Crop Name"
                    value={newCrop.name}
                    onChange={(e) => setNewCrop({...newCrop, name: e.target.value})}
                  />
                  <input
                    type="date"
                    value={newCrop.plantingDate}
                    onChange={(e) => setNewCrop({...newCrop, plantingDate: e.target.value})}
                  />
                  <input
                    type="date"
                    placeholder="Expected Harvest"
                    value={newCrop.expectedHarvest}
                    onChange={(e) => setNewCrop({...newCrop, expectedHarvest: e.target.value})}
                  />
                  <select
                    value={newCrop.waterRequirement}
                    onChange={(e) => setNewCrop({...newCrop, waterRequirement: e.target.value})}
                  >
                    <option value="">Water Requirement</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Fertilizer Type"
                    value={newCrop.fertilizerType}
                    onChange={(e) => setNewCrop({...newCrop, fertilizerType: e.target.value})}
                  />
                  <textarea
                    placeholder="Notes"
                    value={newCrop.notes}
                    onChange={(e) => setNewCrop({...newCrop, notes: e.target.value})}
                  />
                </div>
                <button className="add-button" onClick={addCrop}>
                  Add Crop
                </button>
              </div>

              <div className="crops-list">
                <h3>My Crops</h3>
                {crops.map(crop => (
                  <div key={crop.id} className="crop-card">
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
                    {crop.notes && (
                      <div className="crop-notes">
                        <p>{crop.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="alerts-section">
              <h3>Farming Alerts & Notifications</h3>
              <div className="alerts-list">
                {alerts.map(alert => (
                  <div key={alert.id} className={`alert-item ${alert.type}`}>
                    <div className="alert-icon-container">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="alert-content">
                      <div className="alert-header">
                        <h4>{alert.title}</h4>
                        <span className={`priority ${alert.priority}`}>
                          {alert.priority.toUpperCase()}
                        </span>
                      </div>
                      <p>{alert.message}</p>
                      <div className="alert-footer">
                        <span className="alert-date">{alert.date}</span>
                        <button className="mark-read">Mark as Read</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropManagement;
