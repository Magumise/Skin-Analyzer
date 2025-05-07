import requests
import json
import os

BASE_URL = 'http://127.0.0.1:8000/api'

def test_registration():
    print("\nTesting User Registration...")
    data = {
        "email": "test@example.com",
        "password": "test123",
        "username": "testuser",
        "first_name": "Test",
        "last_name": "User"
    }
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    try:
        # Send POST request with JSON data
        response = requests.post(
            f"{BASE_URL}/users/register/",
            json=data,  # This will automatically set Content-Type and encode the data
            headers=headers
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error during registration: {e}")
        return None

def test_login(email, password):
    print("\nTesting Login...")
    data = {
        "email": email,
        "password": password
    }
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    try:
        # Send POST request with JSON data
        response = requests.post(
            f"{BASE_URL}/users/login/",
            json=data,  # This will automatically set Content-Type and encode the data
            headers=headers
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error during login: {e}")
        return None

def test_upload_image(token):
    print("\nTesting Image Upload...")
    headers = {'Authorization': f'Bearer {token}'}
    
    # Create a test image
    with open('test_image.jpg', 'wb') as f:
        f.write(b'fake image data')
    
    files = {'image': open('test_image.jpg', 'rb')}
    response = requests.post(f"{BASE_URL}/analysis/upload/", headers=headers, files=files)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Clean up test image
    os.remove('test_image.jpg')
    return response.json()

def test_get_products():
    print("\nTesting Get Products...")
    response = requests.get(f"{BASE_URL}/recommendations/products/")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.json()

def test_get_recommendations(token):
    print("\nTesting Get Recommendations...")
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(f"{BASE_URL}/recommendations/user/", headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.json()

def main():
    # Test registration
    registration_data = test_registration()
    
    # Test login
    login_data = test_login("test@example.com", "test123")
    token = login_data.get('access')
    
    if token:
        # Test image upload
        analysis_data = test_upload_image(token)
        
        # Test get products
        products = test_get_products()
        
        # Test get recommendations
        recommendations = test_get_recommendations(token)
    else:
        print("Login failed, skipping authenticated tests")

if __name__ == "__main__":
    main() 