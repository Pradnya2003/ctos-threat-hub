#!/usr/bin/env python3
"""
Initialize users collection and indexes
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


async def init_users_collection():
    try:
        client = AsyncIOMotorClient(MONGODB_URL, server_api=ServerApi("1"))
        db = client[DATABASE_NAME]
        users = db["users"]

        # Create unique index for email
        await users.create_index("email", unique=True)
        print("✅ Unique index created on email field")

        # Check collection
        collections = await db.list_collection_names()
        if "users" in collections:
            print("✅ Users collection ready")
        else:
            print("⚠️ Users collection will be created automatically on first insert")

    except Exception as e:
        print(f"❌ Error initializing users collection: {e}")
    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(init_users_collection())