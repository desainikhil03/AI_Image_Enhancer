# AI Image Enhancer Backend

This is the Flask backend for the AI Image Enhancer project. It provides APIs for image upload and processing, ready to be integrated with a machine learning model for image denoising.

## Setup Instructions

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the Flask application:
```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### 1. Health Check
- **URL**: `/api/health`
- **Method**: GET
- **Description**: Check if the server is running
- **Response**: `{"status": "healthy"}`

### 2. Upload Image
- **URL**: `/api/upload`
- **Method**: POST
- **Description**: Upload an image file
- **Request Body**: Form-data with key 'image'
- **Response**: 
  ```json
  {
    "message": "Image uploaded successfully",
    "filename": "filename.jpg"
  }
  ```

### 3. Process Image
- **URL**: `/api/process`
- **Method**: POST
- **Description**: Process an image (placeholder for ML model integration)
- **Request Body**: Form-data with key 'image'
- **Response**: 
  ```json
  {
    "message": "Image processed successfully",
    "image": "hex_encoded_image_data"
  }
  ```

## Directory Structure
```
.
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── uploads/           # Directory for uploaded images
└── backend_README.md  # This file
```

## Notes
- The backend is configured to accept common image formats (png, jpg, jpeg, gif, bmp)
- CORS is enabled to allow frontend integration
- The `/api/process` endpoint is ready for ML model integration
- Uploaded images are stored in the `uploads/` directory 