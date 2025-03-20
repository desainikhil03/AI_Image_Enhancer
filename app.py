from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
import os
from datetime import datetime
import json
from PIL import Image
import io
import base64
import numpy as np

app = Flask(__name__, static_folder='.')
CORS(app)  # Enable CORS for all routes

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Configure feedback storage
FEEDBACK_FILE = 'feedback.json'

# Serve the main page
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# Serve static files (CSS, JS)
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

def save_feedback(feedback_data):
    """Save feedback to a JSON file"""
    try:
        if os.path.exists(FEEDBACK_FILE):
            with open(FEEDBACK_FILE, 'r') as f:
                feedback_list = json.load(f)
        else:
            feedback_list = []
        
        # Add timestamp to feedback
        feedback_data['timestamp'] = datetime.now().isoformat()
        feedback_list.append(feedback_data)
        
        with open(FEEDBACK_FILE, 'w') as f:
            json.dump(feedback_list, f, indent=4)
        return True
    except Exception as e:
        print(f"Error saving feedback: {str(e)}")
        return False

def process_image(image_data):
    """
    Placeholder for ML model integration
    This function will be replaced with actual ML model processing
    """
    try:
        # Convert base64 to image
        image_bytes = base64.b64decode(image_data.split(',')[1])
        image = Image.open(io.BytesIO(image_bytes))
        
        # TODO: Replace this with actual ML model processing
        # For now, we'll just return the original image
        # Your sir can replace this function with the actual ML model implementation
        
        # Convert back to base64
        buffered = io.BytesIO()
        image.save(buffered, format="PNG")
        enhanced_image = base64.b64encode(buffered.getvalue()).decode('utf-8')
        return f"data:image/png;base64,{enhanced_image}"
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        return None

@app.route('/api/enhance', methods=['POST'])
def enhance_image():
    """Endpoint for image enhancement"""
    try:
        data = request.json
        image_data = data.get('image')
        enhancement_level = data.get('level', 2)  # Default enhancement level is 2
        
        if not image_data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Process the image (this will be replaced with actual ML model)
        enhanced_image = process_image(image_data)
        
        if enhanced_image:
            return jsonify({
                'status': 'success',
                'enhanced_image': enhanced_image
            })
        else:
            return jsonify({'error': 'Failed to process image'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    """Endpoint for submitting feedback"""
    try:
        feedback_data = request.json
        required_fields = ['name', 'email', 'rating', 'feedback']
        
        # Validate required fields
        for field in required_fields:
            if field not in feedback_data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Save feedback
        if save_feedback(feedback_data):
            return jsonify({'status': 'success', 'message': 'Feedback submitted successfully'})
        else:
            return jsonify({'error': 'Failed to save feedback'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'API is running'})

if __name__ == '__main__':
    app.run(debug=True, port=5000) 