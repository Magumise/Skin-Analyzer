import requests
import json

def test_register():
    url = 'http://127.0.0.1:8000/api/users/register/'
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
    
    print("Sending registration request...")
    print(f"URL: {url}")
    print(f"Data: {json.dumps(data, indent=2)}")
    print(f"Headers: {json.dumps(headers, indent=2)}")
    
    try:
        response = requests.post(url, json=data, headers=headers)
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    test_register() 