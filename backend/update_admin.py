#!/usr/bin/env python3
"""
Update existing user to admin
"""

import asyncio
import os
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

if not MONGODB_URL or not DATABASE_NAME:
    raise ValueError("❌ MONGODB_URL or DATABASE_NAME not found in .env file")

async def update_user_to_admin():
    try:
        client = AsyncIOMotorClient(MONGODB_URL, server_api=ServerApi("1"))
        db = client[DATABASE_NAME]
        users = db["users"]

        email = "admin@test.com"

        # Update user to admin
        result = await users.update_one(
            {"email": email},
            {"$set": {"is_admin": True}}
        )

        if result.modified_count > 0:
            print("✅ User updated to admin successfully")
            print(f"📧 Email: {email}")
        else:
            print("ℹ️ User already has admin rights or not found")

    except Exception as e:
        print(f"❌ Error updating user: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(update_user_to_admin())
