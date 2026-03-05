#!/usr/bin/env python3
"""
Create a test admin user
"""

import asyncio
import os
from datetime import datetime
import bcrypt
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

if not MONGODB_URL or not DATABASE_NAME:
    raise ValueError("❌ MONGODB_URL or DATABASE_NAME not found in .env file")


async def create_test_user():
    try:
        client = AsyncIOMotorClient(MONGODB_URL, server_api=ServerApi("1"))
        db = client[DATABASE_NAME]
        users = db["users"]

        email = "admin@ctos-test.com"
        password = "test123"

        # Check existing user
        existing = await users.find_one({"email": email})
        if existing:
            print("✅ Test user already exists")
            print(f"📧 Email: {email}")
            print(f"🔑 Password: {password}")
            return

        # Hash password
        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")[:72]

        user_doc = {
            "username": "admin",
            "email": email,
            "company_name": "CTOS Test Organization",
            "company_website": "https://ctos-threat-hub.local",
            "hashed_password": hashed_password,
            "is_active": True,
            "is_verified": True,
            "created_at": datetime.utcnow(),
            "privacy_policy_accepted": True
        }

        result = await users.insert_one(user_doc)

        print("✅ Test user created successfully")
        print(f"🆔 ID: {result.inserted_id}")
        print(f"📧 Email: {email}")
        print(f"🔑 Password: {password}")

    except Exception as e:
        print(f"❌ Error creating test user: {e}")
    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(create_test_user())