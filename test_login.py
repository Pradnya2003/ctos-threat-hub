import requests
import json

def test_login():
    url = "http://localhost:8000/api/auth/login"
    data = {
        "email": "admin@ctos-test.com",
        "password": "test123"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Login successful!")
            token_data = response.json()
            print(f"Token: {token_data.get('access_token', 'N/A')[:50]}...")
        else:
            print("❌ Login failed")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_login()
