from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import base64
import io
from PIL import Image

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the image data from the request
        data = request.json
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400

        # Decode base64 image
        image_data = base64.b64decode(data['image'])
        
        # Create a file-like object from the image data
        image_file = io.BytesIO(image_data)
        
        # Create a FormData object with the correct field name
        files = {'file': ('image.jpg', image_file, 'image/jpeg')}
        
        # Forward the request to the cloud function
        response = requests.post(
            'https://us-central1-aurora-457407.cloudfunctions.net/predict',
            files=files,
            headers={
                'Accept': 'application/json'
            }
        )
        
        # Check if the response is successful
        if response.status_code != 200:
            return jsonify({'error': f'Cloud function error: {response.text}'}), response.status_code
        
        # Return the response from the cloud function
        return jsonify(response.json()), 200
        
    except Exception as e:
        print(f"Error in proxy server: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True) 