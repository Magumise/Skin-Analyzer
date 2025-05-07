import requests
import os
import sys

def test_ai_endpoint():
    """
    Test the AI model endpoint with a sample image
    """
    url = "https://us-central1-aurora-457407.cloudfunctions.net/predict"
    
    # Check if an image path was provided
    if len(sys.argv) > 1:
        image_path = sys.argv[1]
    else:
        # Use a default image if none provided
        image_path = "test_image.jpg"
        # Create a simple test image if it doesn't exist
        if not os.path.exists(image_path):
            from PIL import Image
            img = Image.new('RGB', (100, 100), color='white')
            img.save(image_path)
            print(f"Created test image: {image_path}")
    
    # Check if the image exists
    if not os.path.exists(image_path):
        print(f"Error: Image file '{image_path}' not found")
        return
    
    print(f"Testing AI endpoint with image: {image_path}")
    
    # Prepare the file for upload
    files = {'file': open(image_path, 'rb')}
    
    try:
        # Send the request
        print("Sending request to AI endpoint...")
        response = requests.post(url, files=files)
        
        # Check the response
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("Success! The AI endpoint is working.")
        else:
            print(f"Error: The AI endpoint returned status code {response.status_code}")
    
    except requests.exceptions.ConnectionError:
        print("Connection error: Could not connect to the AI endpoint")
    except requests.exceptions.Timeout:
        print("Timeout error: The request timed out")
    except Exception as e:
        print(f"Error: {str(e)}")
    finally:
        # Close the file
        files['file'].close()

if __name__ == "__main__":
    test_ai_endpoint() 