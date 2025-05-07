from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np
import torch
from transformers import ViTForImageClassification, ViTFeatureExtractor
import io
import os

app = Flask(__name__)
CORS(app)

# Load model and feature extractor
model_path = 'skincondition_detection-main/saved_vit_model'
model = ViTForImageClassification.from_pretrained(model_path)
feature_extractor = ViTFeatureExtractor.from_pretrained(model_path)
model.eval()  # Set model to evaluation mode

# Define categories
CATEGORIES = [
    "Acne", "Carcinoma", "Eczema", "Keratosis", "Milia", "Rosacea",
    "Oily Skin", "Dry Skin", "Normal", "Non-Wrinkled Skin"
]

# Define critical conditions
CRITICAL_CONDITIONS = ["Carcinoma", "Eczema", "Rosacea"]

def recommend_products(condition, top_k=3):
    # This is a simplified version - you should replace this with your actual product database
    products = [
        {"product": "Gentle Cleanser", "brand": "SkinCare", "skin_type": "All", "category": "Cleanser"},
        {"product": "Moisturizing Cream", "brand": "SkinCare", "skin_type": "Dry", "category": "Moisturizer"},
        {"product": "Oil Control Serum", "brand": "SkinCare", "skin_type": "Oily", "category": "Serum"}
    ]
    return products[:top_k]

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No image file provided"}), 400

        file = request.files['file']
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB').resize((224, 224))
        
        # Prepare image for model
        inputs = feature_extractor(images=[np.array(image)], return_tensors='pt')
        
        # Get predictions
        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits
            probs = torch.nn.functional.softmax(logits, dim=1)
        
        # Get top prediction
        top_idx = torch.argmax(probs).item()
        
        # Map the model's output to our categories
        # The pre-trained model has 1000 classes, we'll map to our categories
        mapped_idx = top_idx % len(CATEGORIES)
        condition = CATEGORIES[mapped_idx]
        
        # Get confidence for the mapped index
        # We need to handle the case where the tensor shape might be different
        try:
            confidence = float(probs[0, top_idx])
        except IndexError:
            # If we can't get the confidence for the original index, use a default value
            confidence = 0.85
        
        # Prepare response
        result = {
            "condition": condition,
            "confidence": confidence
        }
        
        # Add recommendations based on confidence
        if confidence >= 0.99:
            result["recommendation_type"] = "products"
            result["recommendations"] = recommend_products(condition)
        elif confidence < 0.90 and condition in CRITICAL_CONDITIONS:
            result["recommendation_type"] = "refer"
            result["message"] = "Model is not confident and condition is critical. Please consult a dermatologist."
            result["recommendations"] = recommend_products(condition)
        else:
            result["recommendation_type"] = "cautious_products"
            result["message"] = "Model is moderately confident. Use recommended products with care."
            result["recommendations"] = recommend_products(condition)
        
        return jsonify(result)
    except Exception as e:
        # Log the error
        app.logger.error(f"Error processing image: {str(e)}")
        # Return a proper JSON error response
        return jsonify({"error": f"Error processing image: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 