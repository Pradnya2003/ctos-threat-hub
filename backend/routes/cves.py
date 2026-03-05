from fastapi import APIRouter, HTTPException
from typing import List
from models.threat_models import CVE
from context.database import get_database

router = APIRouter()

@router.get("/", response_model=List[CVE])
async def get_cves():
    """Get all CVEs"""
    try:
        db = get_database()
        collection = db["cves"]
        if collection is None:
            raise HTTPException(status_code=500, detail="Database connection not available")
        
        cves = []
        async for document in collection.find():
            cves.append(CVE(**document))
        
        return cves
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching CVEs: {str(e)}")

@router.get("/{cve_id}", response_model=CVE)
async def get_cve(cve_id: str):
    """Get a specific CVE by ID"""
    try:
        db = get_database()
        collection = db["cves"]
        if collection is None:
            raise HTTPException(status_code=500, detail="Database connection not available")
        
        document = await collection.find_one({"id": cve_id})
        if document:
            return CVE(**document)
        else:
            raise HTTPException(status_code=404, detail="CVE not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching CVE: {str(e)}")

@router.get("/severity/{severity}", response_model=List[CVE])
async def get_cves_by_severity(severity: str):
    """Get CVEs by severity level"""
    try:
        db = get_database()
        collection = db["cves"]
        if collection is None:
            raise HTTPException(status_code=500, detail="Database connection not available")
        
        cves = []
        async for document in collection.find({"severity": severity}):
            cves.append(CVE(**document))
        
        return cves
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching CVEs by severity: {str(e)}")
