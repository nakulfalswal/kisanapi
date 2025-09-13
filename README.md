# Crop Recommendation System

An AI-powered crop recommendation system that helps farmers choose the best crops based on soil and climate conditions.

## Features

- 🤖 **AI-Powered Recommendations**: Uses machine learning to analyze soil and climate data
- 🌱 **22+ Crop Types**: Supports recommendations for various crops including rice, maize, fruits, and vegetables
- 📊 **Comprehensive Analysis**: Considers 7 key parameters (N, P, K, temperature, humidity, pH, rainfall)
- 🎨 **Beautiful UI**: Modern, responsive React interface with smooth animations
- ⚡ **Real-time Predictions**: Fast API responses with confidence scores
- 📱 **Mobile Friendly**: Responsive design that works on all devices

## Project Structure

```
kisan_Api/
├── backend/                 # Flask API and ML Model
│   ├── app.py              # Flask application
│   ├── crop_model.py       # Machine learning model
│   └── requirements.txt    # Python dependencies
├── frontend/               # React UI
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json       # Node.js dependencies
└── README.md              # This file
```

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### 1. Setup Backend (Flask API)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask server
python app.py
```

The API will be available at `http://localhost:5000`

### 2. Setup Frontend (React UI)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The UI will be available at `http://localhost:3000`

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/predict` - Get crop recommendation
- `GET /api/crops` - List available crops
- `GET /api/crop-info` - Get crop information

### Prediction Request Format

```json
{
  "N": 80,
  "P": 40,
  "K": 40,
  "temperature": 25,
  "humidity": 80,
  "ph": 6.5,
  "rainfall": 200
}
```

### Prediction Response Format

```json
{
  "success": true,
  "prediction": {
    "recommended_crop": "rice",
    "top_predictions": [
      {"crop": "rice", "probability": 85.2},
      {"crop": "maize", "probability": 12.1},
      {"crop": "banana", "probability": 2.7}
    ]
  },
  "input_parameters": {
    "N": 80,
    "P": 40,
    "K": 40,
    "temperature": 25,
    "humidity": 80,
    "ph": 6.5,
    "rainfall": 200
  }
}
```

## Model Details

The system uses a **Random Forest Classifier** trained on synthetic data representing typical crop requirements. The model considers:

- **N (Nitrogen)**: 0-200 kg/ha
- **P (Phosphorus)**: 0-200 kg/ha  
- **K (Potassium)**: 0-200 kg/ha
- **Temperature**: 0-50°C
- **Humidity**: 0-100%
- **pH Level**: 0-14
- **Rainfall**: 0-500mm

## Supported Crops

The system can recommend 22 different crop types:

**Cereals**: Rice, Maize  
**Legumes**: Chickpea, Kidney beans, Pigeon peas, Moth beans, Mung bean, Black gram, Lentil  
**Fruits**: Pomegranate, Banana, Mango, Grapes, Watermelon, Muskmelon, Apple, Orange, Papaya, Coconut  
**Others**: Cotton, Jute, Coffee  

## Development

### Backend Development

```bash
cd backend
python app.py  # Runs in debug mode
```

### Frontend Development

```bash
cd frontend
npm start  # Runs with hot reload
```

### Building for Production

```bash
# Build React app
cd frontend
npm run build

# The built files will be in frontend/build/
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Disclaimer

This tool provides recommendations based on machine learning analysis. Please consult with agricultural experts for specific farming decisions.
