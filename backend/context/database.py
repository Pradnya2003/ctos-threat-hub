from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

client = AsyncIOMotorClient(MONGODB_URL, server_api=ServerApi("1"))
database = client[DATABASE_NAME]


async def connect_to_mongo():
    global client, database
    client = AsyncIOMotorClient(MONGODB_URL, server_api=ServerApi("1"))
    database = client[DATABASE_NAME]
    print("✅ Connected to MongoDB")


async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("🔌 MongoDB connection closed")


def get_database():
    return database