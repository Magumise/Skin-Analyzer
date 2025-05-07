import os
import requests
from pathlib import Path

def download_model():
    model_dir = Path("skincondition_detection-main/saved_vit_model")
    model_path = model_dir / "model.safetensors"
    
    # Create directory if it doesn't exist
    model_dir.mkdir(parents=True, exist_ok=True)
    
    # If model already exists, skip download
    if model_path.exists():
        print("Model file already exists, skipping download")
        return
    
    # Model URL (you'll need to host this file somewhere and update the URL)
    model_url = "https://huggingface.co/datasets/your-username/your-model/resolve/main/model.safetensors"
    
    print(f"Downloading model from {model_url}")
    response = requests.get(model_url, stream=True)
    response.raise_for_status()
    
    # Save the file
    with open(model_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
    
    print("Model downloaded successfully")

if __name__ == "__main__":
    download_model() 