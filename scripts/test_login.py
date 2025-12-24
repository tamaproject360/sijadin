#!/usr/bin/env python
"""
Test login functionality
"""
import requests
import json

API_URL = "http://localhost:8000/api/v1"

def test_login():
    """Test login with default credentials."""
    print("=" * 60)
    print("Testing Sijadin Login")
    print("=" * 60)
    print()
    
    # Login credentials
    email = "admin@sijadin.local"
    password = "admin123"
    
    print(f"Attempting login...")
    print(f"Email: {email}")
    print(f"Password: {password}")
    print()
    
    try:
        # Login request
        response = requests.post(
            f"{API_URL}/auth/login",
            json={"email": email, "password": password}
        )
        
        if response.status_code == 200:
            data = response.json()
            token = data.get("access_token")
            
            print("✅ Login successful!")
            print(f"Token: {token[:50]}...")
            print()
            
            # Test /auth/me endpoint
            print("Testing /auth/me endpoint...")
            me_response = requests.get(
                f"{API_URL}/auth/me",
                headers={"Authorization": f"Bearer {token}"}
            )
            
            if me_response.status_code == 200:
                user_data = me_response.json()
                print("✅ User info retrieved!")
                print(f"ID: {user_data.get('id')}")
                print(f"Email: {user_data.get('email')}")
                print(f"Role: {user_data.get('role')}")
            else:
                print(f"❌ Failed to get user info: {me_response.status_code}")
                print(me_response.text)
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(response.text)
    
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API server!")
        print("Make sure the API is running at http://localhost:8000")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    print()
    print("=" * 60)


if __name__ == "__main__":
    test_login()
