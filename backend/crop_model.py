try:
    import pandas as pd
    import numpy as np
    from sklearn.model_selection import train_test_split
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.metrics import accuracy_score, classification_report
    import joblib
    import os
    DEPENDENCIES_AVAILABLE = True
except ImportError as e:
    print(f"Warning: Some dependencies are missing: {e}")
    print("Please install required packages: pip install scikit-learn pandas numpy joblib")
    DEPENDENCIES_AVAILABLE = False

class CropRecommendationModel:
    def __init__(self):
        if not DEPENDENCIES_AVAILABLE:
            raise ImportError("Required dependencies are not available. Please install them first.")
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.feature_columns = [
            'N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'
        ]
        self.crop_labels = []
        
    def create_sample_data(self):
        """Create sample dataset for crop recommendation"""
        np.random.seed(42)
        n_samples = 1000
        
        # Generate synthetic data based on typical crop requirements
        data = []
        
        # Define crop requirements (N, P, K, temp, humidity, ph, rainfall)
        crop_requirements = {
            'rice': [80, 40, 40, 25, 80, 6.5, 200],
            'maize': [60, 30, 30, 28, 60, 6.0, 150],
            'chickpea': [20, 40, 20, 25, 50, 7.0, 100],
            'kidneybeans': [25, 35, 25, 26, 55, 6.5, 120],
            'pigeonpeas': [30, 30, 30, 28, 50, 6.8, 110],
            'mothbeans': [20, 30, 20, 30, 45, 7.2, 80],
            'mungbean': [25, 25, 25, 30, 50, 6.5, 90],
            'blackgram': [30, 25, 30, 32, 45, 6.8, 85],
            'lentil': [20, 35, 20, 24, 55, 7.0, 100],
            'pomegranate': [40, 20, 20, 30, 60, 6.5, 120],
            'banana': [60, 30, 40, 30, 70, 6.0, 180],
            'mango': [50, 25, 30, 32, 65, 6.5, 150],
            'grapes': [30, 20, 20, 28, 50, 6.8, 100],
            'watermelon': [40, 20, 30, 35, 60, 6.5, 120],
            'muskmelon': [35, 25, 25, 32, 55, 6.8, 110],
            'apple': [30, 20, 20, 20, 70, 6.5, 140],
            'orange': [40, 25, 25, 25, 65, 6.0, 160],
            'papaya': [50, 30, 35, 30, 70, 6.5, 170],
            'coconut': [60, 40, 50, 30, 80, 6.0, 200],
            'cotton': [80, 50, 60, 35, 50, 6.5, 100],
            'jute': [70, 40, 50, 30, 80, 6.8, 180],
            'coffee': [40, 30, 30, 22, 80, 6.0, 200]
        }
        
        for crop, requirements in crop_requirements.items():
            for _ in range(n_samples // len(crop_requirements)):
                # Add some variation to the requirements
                sample = []
                for i, req in enumerate(requirements):
                    if i == 3:  # temperature
                        variation = np.random.normal(0, 3)
                    elif i == 4:  # humidity
                        variation = np.random.normal(0, 10)
                    elif i == 5:  # ph
                        variation = np.random.normal(0, 0.5)
                    elif i == 6:  # rainfall
                        variation = np.random.normal(0, 30)
                    else:  # N, P, K
                        variation = np.random.normal(0, 10)
                    
                    sample.append(max(0, req + variation))
                
                sample.append(crop)
                data.append(sample)
        
        # Create DataFrame
        columns = self.feature_columns + ['label']
        df = pd.DataFrame(data, columns=columns)
        
        return df
    
    def train_model(self, df=None):
        """Train the crop recommendation model"""
        if df is None:
            df = self.create_sample_data()
        
        # Prepare features and target
        X = df[self.feature_columns]
        y = df['label']
        
        # Store crop labels for later use
        self.crop_labels = sorted(y.unique().tolist())
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Train the model
        self.model.fit(X_train, y_train)
        
        # Evaluate the model
        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        print(f"Model Accuracy: {accuracy:.2f}")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred))
        
        return accuracy
    
    def predict_crop(self, features):
        """Predict crop based on input features"""
        if not hasattr(self, 'model') or self.model is None:
            raise ValueError("Model not trained yet. Please train the model first.")
        
        # Convert to numpy array and reshape
        features_array = np.array(features).reshape(1, -1)
        
        # Make prediction
        prediction = self.model.predict(features_array)[0]
        probabilities = self.model.predict_proba(features_array)[0]
        
        # Get top 3 predictions with probabilities
        top_indices = np.argsort(probabilities)[-3:][::-1]
        top_predictions = []
        
        for idx in top_indices:
            crop = self.crop_labels[idx]
            probability = probabilities[idx]
            top_predictions.append({
                'crop': crop,
                'probability': round(probability * 100, 2)
            })
        
        return {
            'recommended_crop': prediction,
            'top_predictions': top_predictions
        }
    
    def save_model(self, filepath='crop_model.pkl'):
        """Save the trained model"""
        model_data = {
            'model': self.model,
            'feature_columns': self.feature_columns,
            'crop_labels': self.crop_labels
        }
        joblib.dump(model_data, filepath)
        print(f"Model saved to {filepath}")
    
    def load_model(self, filepath='crop_model.pkl'):
        """Load a trained model"""
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Model file {filepath} not found")
        
        model_data = joblib.load(filepath)
        self.model = model_data['model']
        self.feature_columns = model_data['feature_columns']
        self.crop_labels = model_data['crop_labels']
        print(f"Model loaded from {filepath}")

if __name__ == "__main__":
    if not DEPENDENCIES_AVAILABLE:
        print("Cannot run model training without required dependencies.")
        print("Please install: pip install scikit-learn pandas numpy joblib")
        exit(1)
    
    # Create and train the model
    crop_model = CropRecommendationModel()
    accuracy = crop_model.train_model()
    
    # Save the model
    crop_model.save_model('crop_model.pkl')
    
    # Test the model with sample data
    sample_features = [80, 40, 40, 25, 80, 6.5, 200]  # Rice-like conditions
    prediction = crop_model.predict_crop(sample_features)
    print(f"\nSample prediction: {prediction}")
