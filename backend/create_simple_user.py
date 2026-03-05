#!/usr/bin/env python3
"""
Create a test user for immediate login - simple version
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os
import bcrypt

load_dotenv()

MONGODB_URL = os.getenv('MONGODB_URL')
DATABASE_NAME = os.getenv('DATABASE_NAME')

async def create_test_user():
    """Create a test user for demo purposes."""
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient(MONGODB_URL, server_api=ServerApi('1'))
        database = client[DATABASE_NAME]
        users_collection = database['users']
        
        # Check if test user already exists
        existing_user = await users_collection.find_one({"email": "admin@ctos.local"})
        if existing_user:
            print("✅ Test user already exists")
            print("📧 Login credentials:")
            print("   Email: admin@ctos.local")
            print("   Password: test123")
        else:
            # Create test user with simple bcrypt hashing
            password = "test123"
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            test_user = {
                "username": "admin",
                "email": "admin@ctos.local",
                "company_name": "CTOS Test Organization",
                "company_website": "https://ctos-threat-hub.local",
                "hashed_password": hashed_password,
                "is_active": True,
                "is_verified": True,
                "created_at": "2024-01-01T00:00:00.000Z",
                "privacy_policy_accepted": True
            }
            
            result = await users_collection.insert_one(test_user)
            print(f"✅ Test user created with ID: {result.inserted_id}")
            print("📧 Login credentials:")
            print("   Email: admin@ctos.local")
            print("   Password: test123")
            
    except Exception as e:
        print(f"❌ Error creating test user: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(create_test_user())
