from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os
import json
from typing import List, Dict, Any

# Import authentication routes and utilities
from routes.auth import router as auth_router
from utils.auth import verify_token

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "ctos_threat_hub")

app = FastAPI(title="CTOS Threat Hub API", version="3.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://192.168.0.12:3000", "http://192.168.31.3:3001", "file://"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
client = None
database = None

@app.on_event("startup")
async def connect_to_mongo():
    global client, database
    try:
        client = AsyncIOMotorClient(MONGODB_URL, server_api=ServerApi('1'))
        await client.admin.command('ping')
        database = client[DATABASE_NAME]
        print(f"Connected to MongoDB at {MONGODB_URL}")
        print(f"Using database: {DATABASE_NAME}")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        raise

@app.on_event("shutdown")
async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("Disconnected from MongoDB")

def get_database():
    return database

# Helper function to convert ObjectId to string
def convert_objectid(doc: Dict[str, Any]) -> Dict[str, Any]:
    if '_id' in doc:
        doc['id'] = str(doc.pop('_id'))
    return doc

# Authentication dependency
security = HTTPBearer()

async def get_current_user_from_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get the current authenticated user from token."""
    token = credentials.credentials
    token_data = verify_token(token)
    
    users_collection = get_database()["users"]
    user = await users_collection.find_one({"email": token_data.email})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated"
        )
    
    return convert_objectid(user)

# Threat Actors endpoints (protected)
@app.get("/api/threat-actors/")
async def get_threat_actors(current_user: dict = Depends(get_current_user_from_token)):
    try:
        collection = get_database()["threat_actors"]
        if collection is None:
            return {"error": "Database connection not available"}
        
        threat_actors = []
        async for document in collection.find():
            threat_actors.append(convert_objectid(document))
        
        return threat_actors
    except Exception as e:
        return {"error": f"Error fetching threat actors: {str(e)}"}

@app.get("/api/threat-actors/{threat_actor_id}")
async def get_threat_actor(threat_actor_id: str, current_user: dict = Depends(get_current_user_from_token)):
    try:
        collection = get_database()["threat_actors"]
        if collection is None:
            return {"error": "Database connection not available"}
        
        document = await collection.find_one({"_id": threat_actor_id})
        if document:
            return convert_objectid(document)
        else:
            return {"error": "Threat actor not found"}
    except Exception as e:
        return {"error": f"Error fetching threat actor: {str(e)}"}

# IOCs endpoints (protected)
@app.get("/api/iocs/")
async def get_iocs(current_user: dict = Depends(get_current_user_from_token)):
    try:
        collection = get_database()["iocs"]
        if collection is None:
            return {"error": "Database connection not available"}
        
        iocs = []
        async for document in collection.find():
            iocs.append(convert_objectid(document))
        
        return iocs
    except Exception as e:
        return {"error": f"Error fetching IOCs: {str(e)}"}

@app.get("/api/iocs/search")
async def search_iocs(q: str, current_user: dict = Depends(get_current_user_from_token)):
    try:
        collection = get_database()["iocs"]
        if collection is None:
            return {"error": "Database connection not available"}
        
        iocs = []
        async for document in collection.find({"value": {"$regex": q, "$options": "i"}}):
            iocs.append(convert_objectid(document))
        
        return iocs
    except Exception as e:
        return {"error": f"Error searching IOCs: {str(e)}"}

# Malware Families endpoints (protected)
@app.get("/api/malware-families/")
async def get_malware_families(current_user: dict = Depends(get_current_user_from_token)):
    try:
        collection = get_database()["malware_families"]
        if collection is None:
            return {"error": "Database connection not available"}
        
        malware_families = []
        async for document in collection.find():
            malware_families.append(convert_objectid(document))
        
        return malware_families
    except Exception as e:
        return {"error": f"Error fetching malware families: {str(e)}"}

# CVEs endpoints (protected)
@app.get("/api/cves/")
async def get_cves(current_user: dict = Depends(get_current_user_from_token)):
    try:
        collection = get_database()["cves"]
        if collection is None:
            return {"error": "Database connection not available"}
        
        cves = []
        async for document in collection.find():
            cves.append(convert_objectid(document))
        
        return cves
    except Exception as e:
        return {"error": f"Error fetching CVEs: {str(e)}"}

@app.get("/")
async def root():
    return {"message": "CTOS Threat Hub API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Include authentication routes
app.include_router(auth_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Enable auto-reload
        reload_dirs=["./"],  # Watch current directory
        log_level="info"
    )
