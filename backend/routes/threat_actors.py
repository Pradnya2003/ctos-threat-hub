from fastapi import APIRouter, HTTPException
from typing import List
from models.threat_models import ThreatActor
from context.database import get_database
router = APIRouter()

@router.get("/", response_model=List[ThreatActor])
async def get_threat_actors():
    """Get all threat actors"""
    try:
        db = get_database()
        collection = db["threat_actors"]        
        if collection is None:
            raise HTTPException(status_code=500, detail="Database connection not available")
        
        threat_actors = []
        async for document in collection.find():
            # Convert ObjectId to string for JSON serialization
            document['id'] = str(document.pop('_id'))
            threat_actors.append(ThreatActor(**document))
        
        return threat_actors
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching threat actors: {str(e)}")

@router.get("/{threat_actor_id}", response_model=ThreatActor)
async def get_threat_actor(threat_actor_id: str):
    """Get a specific threat actor by ID"""
    try:
        db = get_database()
        if db is None:
            raise HTTPException(status_code=500, detail="Database connection not available")
        collection = db["threat_actors"]
        
        from bson import ObjectId
        try:
            object_id = ObjectId(threat_actor_id)
        except:
            raise HTTPException(status_code=400, detail="Invalid threat actor ID format")
            
        document = await collection.find_one({"_id": object_id})
        if document:
            document['id'] = str(document.pop('_id'))
            return ThreatActor(**document)
        else:
            raise HTTPException(status_code=404, detail="Threat actor not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching threat actor: {str(e)}")

@router.get("/category/{category}", response_model=List[ThreatActor])
async def get_threat_actors_by_category(category: str):
    """Get threat actors by category"""
    try:
        db = get_database()
        if db is None:
            raise HTTPException(status_code=500, detail="Database connection not available")
        collection = db["threat_actors"]
        
        threat_actors = []
        async for document in collection.find({"category": category}):
            document['id'] = str(document.pop('_id'))
            threat_actors.append(ThreatActor(**document))
        
        return threat_actors
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching threat actors by category: {str(e)}")

@router.get("/status/{status}", response_model=List[ThreatActor])
async def get_threat_actors_by_status(status: str):
    """Get threat actors by status"""
    try:
        db = get_database()
        if db is None:
            raise HTTPException(status_code=500, detail="Database connection not available")
        collection = db["threat_actors"]
        
        threat_actors = []
        async for document in collection.find({"status": status}):
            document['id'] = str(document.pop('_id'))
            threat_actors.append(ThreatActor(**document))
        
        return threat_actors
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching threat actors by status: {str(e)}")
