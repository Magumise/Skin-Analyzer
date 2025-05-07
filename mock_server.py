from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

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

        # Generate a random condition and confidence
        condition = random.choice(CATEGORIES)
        confidence = random.uniform(0.8, 1.0)
        
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