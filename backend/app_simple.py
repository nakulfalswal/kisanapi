from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Mock crop data for testing
MOCK_CROPS = [
    'rice', 'maize', 'chickpea', 'kidneybeans', 'pigeonpeas', 'mothbeans',
    'mungbean', 'blackgram', 'lentil', 'pomegranate', 'banana', 'mango',
    'grapes', 'watermelon', 'muskmelon', 'apple', 'orange', 'papaya',
    'coconut', 'cotton', 'jute', 'coffee'
]

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Crop Recommendation API is running (Mock Mode)',
        'model_available': True
    })

@app.route('/api/predict', methods=['POST'])
def predict_crop():
    """Predict crop recommendation based on input parameters (Mock)"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Extract features
        features = [
            data['N'],
            data['P'], 
            data['K'],
            data['temperature'],
            data['humidity'],
            data['ph'],
            data['rainfall']
        ]
        
        # Validate data types and ranges
        try:
            features = [float(f) for f in features]
        except (ValueError, TypeError):
            return jsonify({
                'error': 'All parameters must be numeric values'
            }), 400
        
        # Basic range validation
        if not (0 <= features[0] <= 200):  # N
            return jsonify({'error': 'N (Nitrogen) must be between 0 and 200'}), 400
        if not (0 <= features[1] <= 200):  # P
            return jsonify({'error': 'P (Phosphorus) must be between 0 and 200'}), 400
        if not (0 <= features[2] <= 200):  # K
            return jsonify({'error': 'K (Potassium) must be between 0 and 200'}), 400
        if not (0 <= features[3] <= 50):  # temperature
            return jsonify({'error': 'Temperature must be between 0 and 50°C'}), 400
        if not (0 <= features[4] <= 100):  # humidity
            return jsonify({'error': 'Humidity must be between 0 and 100%'}), 400
        if not (0 <= features[5] <= 14):  # ph
            return jsonify({'error': 'pH must be between 0 and 14'}), 400
        if not (0 <= features[6] <= 500):  # rainfall
            return jsonify({'error': 'Rainfall must be between 0 and 500mm'}), 400
        
        # Mock prediction logic based on simple rules
        recommended_crop = get_mock_prediction(features)
        
        return jsonify({
            'success': True,
            'prediction': {
                'recommended_crop': recommended_crop,
                'top_predictions': [
                    {'crop': recommended_crop, 'probability': 85.5},
                    {'crop': 'maize', 'probability': 12.3},
                    {'crop': 'rice', 'probability': 2.2}
                ]
            },
            'input_parameters': {
                'N': features[0],
                'P': features[1],
                'K': features[2],
                'temperature': features[3],
                'humidity': features[4],
                'ph': features[5],
                'rainfall': features[6]
            }
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Prediction failed: {str(e)}'
        }), 500

def get_mock_prediction(features):
    """Simple mock prediction based on input values"""
    n, p, k, temp, humidity, ph, rainfall = features
    
    # Simple rule-based prediction
    if temp > 30 and humidity > 70 and rainfall > 150:
        return 'rice'
    elif temp > 25 and humidity > 60 and rainfall > 100:
        return 'maize'
    elif temp < 25 and humidity < 60 and rainfall < 100:
        return 'chickpea'
    elif temp > 30 and humidity > 65:
        return 'banana'
    elif temp > 25 and humidity > 50:
        return 'mango'
    elif temp > 30 and humidity < 50:
        return 'cotton'
    else:
        return 'maize'  # default

@app.route('/api/crops', methods=['GET'])
def get_available_crops():
    """Get list of available crops that can be recommended"""
    try:
        return jsonify({
            'success': True,
            'crops': MOCK_CROPS
        })
    except Exception as e:
        return jsonify({
            'error': f'Failed to get crops: {str(e)}'
        }), 500

@app.route('/api/crop-info', methods=['GET'])
def get_crop_info():
    """Get information about different crops"""
    crop_info = {
        'rice': {
            'name': 'Rice',
            'description': 'Staple food crop requiring high water and nitrogen',
            'optimal_conditions': 'High humidity, moderate temperature, high rainfall'
        },
        'maize': {
            'name': 'Maize',
            'description': 'Cereal crop with high yield potential',
            'optimal_conditions': 'Warm temperature, moderate humidity, good rainfall'
        },
        'chickpea': {
            'name': 'Chickpea',
            'description': 'Protein-rich legume crop',
            'optimal_conditions': 'Cool temperature, moderate humidity, low rainfall'
        },
        'banana': {
            'name': 'Banana',
            'description': 'Tropical fruit crop',
            'optimal_conditions': 'High temperature, high humidity, good rainfall'
        },
        'mango': {
            'name': 'Mango',
            'description': 'Tropical fruit tree',
            'optimal_conditions': 'Warm temperature, moderate humidity, seasonal rainfall'
        },
        'cotton': {
            'name': 'Cotton',
            'description': 'Fiber crop for textile industry',
            'optimal_conditions': 'High temperature, low humidity, moderate rainfall'
        }
    }
    
    return jsonify({
        'success': True,
        'crop_info': crop_info
    })

if __name__ == '__main__':
    print("Starting Crop Recommendation API (Mock Mode)...")
    print("API will be available at: http://localhost:5000")
    print("Available endpoints:")
    print("- GET  /api/health")
    print("- POST /api/predict")
    print("- GET  /api/crops")
    print("- GET  /api/crop-info")
    print("\nNote: This is running in mock mode without ML dependencies")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
