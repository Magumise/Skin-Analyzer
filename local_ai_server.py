from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from PIL import Image
import numpy as np
import torch
from transformers import ViTForImageClassification, ViTFeatureExtractor
import io
import os
import csv
import random
import logging
import json
import base64
from werkzeug.utils import secure_filename

app = Flask(__name__)
# Configure CORS to allow all origins and methods
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"], "allow_headers": ["Content-Type"]}})

# Configure logging
logging.basicConfig(level=logging.INFO)
app.logger.setLevel(logging.INFO)

# Increase the maximum content length to handle larger images
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max

# Load model and feature extractor
model_path = 'skincondition_detection-main/saved_vit_model'
model = ViTForImageClassification.from_pretrained(model_path)
feature_extractor = ViTFeatureExtractor.from_pretrained(model_path)
model.eval()  # Set model to evaluation mode

# Define categories with their corresponding ImageNet class ranges
CATEGORIES = [
    "Acne", "Carcinoma", "Eczema", "Keratosis", "Milia", "Rosacea",
    "Oily Skin", "Dry Skin", "Normal", "Non-Wrinkled Skin"
]

# Map ImageNet classes to skin conditions (example ranges - adjust based on your model)
CATEGORY_RANGES = {
    "Acne": (0, 100),
    "Carcinoma": (101, 200),
    "Eczema": (201, 300),
    "Keratosis": (301, 400),
    "Milia": (401, 500),
    "Rosacea": (501, 600),
    "Oily Skin": (601, 700),
    "Dry Skin": (701, 800),
    "Normal": (801, 900),
    "Non-Wrinkled Skin": (901, 1000)
}

# Define critical conditions
CRITICAL_CONDITIONS = ["Carcinoma", "Eczema", "Rosacea"]

def generate_image_url(product_name, category):
    """Generate a more specific placeholder image URL based on product name and category."""
    # Clean the product name for URL
    clean_name = product_name.replace(' ', '+')
    # Use a more specific placeholder with both category and product name
    return f"https://via.placeholder.com/300x300/E53E3E/FFFFFF?text={category}%0A{clean_name}"

def load_products_from_csv():
    products = []
    try:
        # Get the absolute path to the CSV file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        csv_path = os.path.join(current_dir, 'skincondition_detection-main', 'aurora_products_B.csv')
        
        app.logger.info(f"Attempting to load products from: {csv_path}")
        
        if not os.path.exists(csv_path):
            app.logger.error(f"CSV file not found at: {csv_path}")
            raise FileNotFoundError(f"CSV file not found at: {csv_path}")
            
        with open(csv_path, 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                if not row['Product']:  # Skip empty product names
                    continue
                    
                # Extract category from product name or use default
                category = row['Product'].split()[0] if ' ' in row['Product'] else "Skincare"
                
                # Add a random price between $10 and $100
                price = round(random.uniform(10, 100), 2)
                
                # Create product object
                product = {
                    "id": len(products) + 1,
                    "name": row['Product'],
                    "brand": "Aurora Beauty",
                    "category": category,
                    "description": f"Targets: {row['Targets']}. Suitable for: {row['Suitable for']}. Apply: {row['When to apply']}",
                    "price": price,
                    "image": generate_image_url(row['Product'], category),
                    "stock": random.randint(10, 100),
                    "suitable_for": row['Suitable for'],
                    "targets": row['Targets'],
                    "when_to_apply": row['When to apply']
                }
                products.append(product)
                
        app.logger.info(f"Successfully loaded {len(products)} products from CSV")
        
    except Exception as e:
        app.logger.error(f"Error loading products from CSV: {str(e)}")
        # Fallback to default products if CSV loading fails
        products = [
            {
                "id": 1,
                "name": "Gentle Cleanser",
                "brand": "Aurora Beauty",
                "category": "Cleanser",
                "description": "A gentle cleanser suitable for all skin types",
                "price": 24.99,
                "image": generate_image_url("Gentle Cleanser", "Cleanser"),
                "stock": 50,
                "suitable_for": "All skin types",
                "targets": "Daily cleansing",
                "when_to_apply": "AM, PM"
            }
        ]
    return products

# Load all products
ALL_PRODUCTS = load_products_from_csv()

def get_category_from_index(idx):
    """Map model output index to skin condition category."""
    for category, (start, end) in CATEGORY_RANGES.items():
        if start <= idx < end:
            return category
    return "Normal"  # Default category if no match found

def recommend_products(condition, top_k=3):
    """
    Recommend products based on the detected skin condition.
    This function matches the condition with suitable products from the CSV.
    """
    recommended_products = []
    
    # Map skin conditions to product targets
    condition_to_targets = {
        "Acne": ["Breakouts & blemishes", "Enlarged pores", "Excess oil", "Black Heads"],
        "Eczema": ["Redness", "Irritation", "Dry Skin", "Sensitive Skin"],
        "Rosacea": ["Redness", "Irritation", "Sensitive Skin"],
        "Oily Skin": ["Sebum control", "Enlarged pores", "Excess oil"],
        "Dry Skin": ["Dry Skin", "Moisturising", "Hyderating"],
        "Normal": ["Dull skin", "Uneven skin tone"],
        "Non-Wrinkled Skin": ["Anti Aging", "Fine Lines", "Wrinkles"]
    }
    
    # Get relevant targets for the condition
    relevant_targets = condition_to_targets.get(condition, ["Dull skin", "Uneven skin tone"])
    
    # Find products that target the condition
    for product in ALL_PRODUCTS:
        # Check if any of the product's targets match the condition's targets
        product_targets = [target.strip() for target in product["targets"].split(",")]
        if any(target in product_targets for target in relevant_targets):
            recommended_products.append(product)
    
    # If no specific matches, return random products
    if not recommended_products:
        recommended_products = random.sample(ALL_PRODUCTS, min(top_k, len(ALL_PRODUCTS)))
    else:
        # Limit to top_k products
        recommended_products = recommended_products[:top_k]
    
    return recommended_products

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
            
            # Get top 3 predictions
            top_probs, top_indices = torch.topk(probs[0], k=3)
            
            # Convert to numpy for easier handling
            top_probs = top_probs.numpy()
            top_indices = top_indices.numpy()
            
            # Map the top prediction to our categories
            condition = get_category_from_index(top_indices[0])
            confidence = float(top_probs[0])
            
            # Get alternative predictions
            alt_predictions = []
            for i in range(1, min(3, len(top_indices))):
                alt_condition = get_category_from_index(top_indices[i])
                alt_confidence = float(top_probs[i])
                if alt_confidence > 0.1:  # Only include if confidence is above 10%
                    alt_predictions.append({
                        "condition": alt_condition,
                        "confidence": alt_confidence
                    })
        
        # Prepare response
        result = {
            "condition": condition,
            "confidence": confidence,
            "alternative_predictions": alt_predictions
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

# Add a new endpoint to get all products
@app.route('/products', methods=['GET'])
def get_all_products():
    return jsonify(ALL_PRODUCTS)

# Add a new endpoint to update product images
@app.route('/update_product_image', methods=['POST', 'OPTIONS'])
def update_product_image():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        response = jsonify({"status": "ok"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
        
    try:
        app.logger.info("Received product image update request")
        data = request.json
        app.logger.info(f"Request data keys: {list(data.keys())}")
        
        product_id = data.get('id')
        image_url = data.get('image')
        
        if not product_id:
            app.logger.error(f"Missing required field: id")
            return jsonify({"error": "Product ID is required"}), 400
            
        if not image_url:
            app.logger.error(f"Missing required field: image")
            return jsonify({"error": "Image data is required"}), 400
        
        # Convert product_id to string for comparison
        product_id_str = str(product_id)
        
        # Find the product and update its image
        for product in ALL_PRODUCTS:
            if str(product['id']) == product_id_str:
                product['image'] = image_url
                app.logger.info(f"Updated image for product ID {product_id_str}")
                return jsonify({"success": True, "product": product})
        
        app.logger.error(f"Product not found with ID: {product_id_str}")
        return jsonify({"error": "Product not found"}), 404
    except Exception as e:
        app.logger.error(f"Error updating product image: {str(e)}")
        return jsonify({"error": f"Error updating product image: {str(e)}"}), 500

# Add a new endpoint to update product
@app.route('/update_product', methods=['POST', 'OPTIONS'])
def update_product():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        response = jsonify({"status": "ok"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
        
    try:
        app.logger.info("Received product update request")
        data = request.json
        app.logger.info(f"Request data keys: {list(data.keys())}")
        
        product_id = data.get('id')
        
        if not product_id:
            app.logger.error(f"Missing required field: id")
            return jsonify({"error": "Product ID is required"}), 400
        
        # Convert product_id to string for comparison
        product_id_str = str(product_id)
        
        # Find the product and update it
        for product in ALL_PRODUCTS:
            if str(product['id']) == product_id_str:
                # Update all fields except id
                for key, value in data.items():
                    if key != 'id':  # Don't update the ID
                        product[key] = value
                
                app.logger.info(f"Updated product ID {product_id_str}")
                return jsonify({"success": True, "product": product})
        
        app.logger.error(f"Product not found with ID: {product_id_str}")
        return jsonify({"error": "Product not found"}), 404
    except Exception as e:
        app.logger.error(f"Error updating product: {str(e)}")
        return jsonify({"error": f"Error updating product: {str(e)}"}), 500

# Add a new endpoint to add product
@app.route('/add_product', methods=['POST', 'OPTIONS'])
def add_product():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        response = jsonify({"status": "ok"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
        
    try:
        app.logger.info("Received add product request")
        data = request.json
        app.logger.info(f"Request data keys: {list(data.keys())}")
        
        # Validate required fields
        required_fields = ['name', 'brand', 'category', 'description', 'price', 'stock']
        for field in required_fields:
            if field not in data:
                app.logger.error(f"Missing required field: {field}")
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Create a new product
        new_product = {
            'id': str(data.get('id', len(ALL_PRODUCTS) + 1)),  # Ensure ID is a string
            'name': data['name'],
            'brand': data['brand'],
            'category': data['category'],
            'description': data['description'],
            'price': float(data['price']),
            'stock': int(data['stock']),
            'image': data.get('image', 'https://via.placeholder.com/300x300?text=No+Image'),
            'suitable_for': data.get('suitable_for', ''),
            'targets': data.get('targets', ''),
            'when_to_apply': data.get('when_to_apply', '')
        }
        
        # Add the new product to the list
        ALL_PRODUCTS.append(new_product)
        
        app.logger.info(f"Added new product: {new_product['name']} with ID {new_product['id']}")
        return jsonify({"success": True, "product": new_product})
    except Exception as e:
        app.logger.error(f"Error adding product: {str(e)}")
        return jsonify({"error": f"Error adding product: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 