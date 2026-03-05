from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from models.threat_models import IOC
from context.database import get_database

router = APIRouter()

@router.get("/", response_model=List[IOC])
async def get_iocs():
    """Get all IOCs"""
    try:
        db = get_database()
        collection = db["iocs"]
        if collection is None:
            raise HTTPException(status_code=500, detail="Database connection not available")
        
        iocs = []
        async for document in collection.find():
            iocs.append(IOC(**document))
        
        return iocs
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching IOCs: {str(e)}")

@router.get("/search", response_model=List[IOC])
async def search_iocs(q: str = Query(..., description="Search query for IOC value")):
    """Search IOCs by value"""
    try:
        db = get_database()
        collection = db["iocs"]
        if collection is None:
            raise HTTPException(status_code=500, detail="Database connection not available")
        
        # Case-insensitive search
        iocs = []
        async for document in collection.find({"value": {"$regex": q, "$options": "i"}}):
            iocs.append(IOC(**document))
        
        return iocs
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching IOCs: {str(e)}")

@router.get("/{ioc_id}", response_model=IOC)
async def get_ioc(ioc_id: str):
    """Get a specific IOC by ID"""
    try:
        db = get_database()
        collection = db["iocs"]
        if collection is None:
            raise HTTPException(status_code=500, detail="Database connection not available")
        
        document = await collection.find_one({"_id": ioc_id})
        if document:
            return IOC(**document)
        else:
            raise HTTPException(status_code=404, detail="IOC not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching IOC: {str(e)}")

@router.get("/type/{ioc_type}", response_model=List[IOC])
async def get_iocs_by_type(ioc_type: str):
    """Get IOCs by type (IP, Domain, Hash, URL)"""
    try:
        db = get_database()
        collection = db["iocs"]
        if collection is None:
            raise HTTPException(status_code=500, detail="Database connection not available")
        
        iocs = []
        async for document in collection.find({"type": ioc_type}):
            iocs.append(IOC(**document))
        
        return iocs
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching IOCs by type: {str(e)}")
