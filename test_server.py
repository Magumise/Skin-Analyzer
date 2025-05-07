from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

# Serve the test page
@app.route('/')
def serve_test_page():
    return send_from_directory('.', 'test_ai_model.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        # Forward the file to the AI model
        files = {'file': (file.filename, file.stream, file.content_type)}
        response = requests.post(
            'https://us-central1-aurora-457407.cloudfunctions.net/predict',
            files=files
        )

        if response.status_code != 200:
            return jsonify({'error': f'AI model error: {response.text}'}), response.status_code

        return jsonify(response.json())

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Server starting at http://localhost:5000")
    app.run(port=5000, debug=True) 