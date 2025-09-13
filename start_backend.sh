#!/bin/bash
echo "Starting Crop Recommendation Backend..."
cd backend
echo "Installing Python dependencies..."
pip install -r requirements.txt
echo "Starting Flask server..."
python app.py
