from transformers import ViTForImageClassification, ViTFeatureExtractor
import torch

def download_model():
    # Download a pre-trained ViT model
    model_name = "google/vit-base-patch16-224"
    model = ViTForImageClassification.from_pretrained(model_name)
    feature_extractor = ViTFeatureExtractor.from_pretrained(model_name)
    
    # Save the model and feature extractor
    save_path = "skincondition_detection-main/saved_vit_model"
    model.save_pretrained(save_path)
    feature_extractor.save_pretrained(save_path)
    print(f"Model and feature extractor saved to {save_path}")

if __name__ == "__main__":
    download_model() 