from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
# Enable CORS for all routes and origins
CORS(app, resources={r"/*": {"origins": "*"}})

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
        {"name": "Gentle Cleanser", "description": "A mild cleanser suitable for all skin types", "price": 15.99, "image_url": "https://via.placeholder.com/150"},
        {"name": "Moisturizing Cream", "description": "Deeply hydrating cream for dry skin", "price": 24.99, "image_url": "https://via.placeholder.com/150"},
        {"name": "Oil Control Serum", "description": "Controls excess oil production", "price": 29.99, "image_url": "https://via.placeholder.com/150"},
        {"name": "Anti-Aging Serum", "description": "Reduces fine lines and wrinkles", "price": 39.99, "image_url": "https://via.placeholder.com/150"},
        {"name": "Sunscreen SPF 50", "description": "Protects against harmful UV rays", "price": 19.99, "image_url": "https://via.placeholder.com/150"}
    ]
    return random.sample(products, min(top_k, len(products)))

@app.route('/predict', methods=['POST'])
def predict():
    print("Received request to /predict")
    if 'file' not in request.files:
        print("No file in request")
        return jsonify({"error": "No image file provided"}), 400

    print("File received:", request.files['file'].filename)
    # In a real implementation, we would process the image here
    # For now, we'll just return a random condition
    condition = random.choice(CATEGORIES)
    confidence = random.uniform(0.7, 0.99)
    
    # Prepare response
    result = {
        "condition": condition,
        "confidence": confidence
    }
    
    # Add recommendations based on confidence
    if confidence >= 0.9:
        result["recommendation_type"] = "products"
        result["message"] = "Your skin condition can be treated with the recommended products."
        result["recommendations"] = recommend_products(condition)
    elif confidence < 0.8 and condition in CRITICAL_CONDITIONS:
        result["recommendation_type"] = "dermatologist"
        result["message"] = "Your condition may require professional medical attention. Please consult a dermatologist."
        result["recommendations"] = recommend_products(condition)
    else:
        result["recommendation_type"] = "products"
        result["message"] = "Your skin condition can be treated with the recommended products, but monitor for changes."
        result["recommendations"] = recommend_products(condition)
    
    print("Sending response:", result)
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 