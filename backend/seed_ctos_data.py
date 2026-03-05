import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os
from bson import ObjectId

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = "ctos_threat_hub"

# Demo data for CTOS Threat Hub
threat_actors_data = [
    {
        "_id": str(ObjectId()),
        "name": "LockBit",
        "category": "Ransomware",
        "status": "Active",
        "description": "LockBit is a notorious ransomware-as-a-service (RaaS) operation that has been active since late 2019.",
        "profileImage": "https://app.foresiet.com/img/24.97c9986c.png",
        "targetedCountries": ["USA", "UK", "Germany", "France", "Canada"],
        "associatedMalware": ["LockBit 3.0", "StealBit"],
        "lastUpdated": "2026-02-20"
    },
    {
        "_id": str(ObjectId()),
        "name": "Lazarus Group",
        "category": "APT",
        "status": "Active",
        "description": "A North Korean state-sponsored cyberespionage group active since at least 2009.",
        "profileImage": "https://app.foresiet.com/img/19.dfb70c36.png",
        "targetedCountries": ["South Korea", "USA", "Japan", "Vietnam"],
        "associatedMalware": ["AppleJeus", "Manuscrypt"],
        "lastUpdated": "2026-02-15"
    }
]

malware_families_data = [
    {
        "_id": str(ObjectId()),
        "name": "Emotet",
        "type": "Botnet",
        "description": "Advanced modular banking trojan and botnet."
    },
    {
        "_id": str(ObjectId()),
        "name": "RedLine Stealer",
        "type": "Stealer",
        "description": "Popular information stealer sold on underground forums."
    },
    {
        "_id": str(ObjectId()),
        "name": "Agent Tesla",
        "type": "Stealer",
        "description": "A remote access trojan (RAT) and spyware."
    },
    {
        "_id": str(ObjectId()),
        "name": "Qakbot",
        "type": "Botnet",
        "description": "Banking trojan turned multi-purpose delivery platform."
    }
]

cves_data = [
    {
        "_id": str(ObjectId()),
        "cveId": "CVE-2024-21413",
        "title": "Microsoft Outlook Remote Code Execution Vulnerability",
        "severity": "Critical"
    },
    {
        "_id": str(ObjectId()),
        "cveId": "CVE-2023-46604",
        "title": "Apache ActiveMQ Remote Code Execution",
        "severity": "Critical"
    },
    {
        "_id": str(ObjectId()),
        "cveId": "CVE-2024-38063",
        "title": "Windows TCP/IP Remote Code Execution Vulnerability",
        "severity": "Critical"
    }
]

iocs_data = [
    {
        "_id": str(ObjectId()),
        "value": "185.244.25.187",
        "type": "IP",
        "firstSeen": "2026-01-10",
        "lastSeen": "2026-02-20"
    },
    {
        "_id": str(ObjectId()),
        "value": "update.microsoft-security.com",
        "type": "Domain",
        "firstSeen": "2026-01-15",
        "lastSeen": "2026-02-22"
    }
]

async def seed_database():
    try:
        client = AsyncIOMotorClient(MONGODB_URL, server_api=ServerApi('1'))
        database = client[DATABASE_NAME]
        
        print(f"Connected to MongoDB at {MONGODB_URL}")
        print(f"Using database: {DATABASE_NAME}")
        
        # Clear existing data
        print("Clearing existing data...")
        await database.threat_actors.delete_many({})
        await database.iocs.delete_many({})
        await database.malware_families.delete_many({})
        await database.cves.delete_many({})
        
        # Insert demo data
        print("Inserting threat actors...")
        await database.threat_actors.insert_many(threat_actors_data)
        
        print("Inserting IOCs...")
        await database.iocs.insert_many(iocs_data)
        
        print("Inserting malware families...")
        await database.malware_families.insert_many(malware_families_data)
        
        print("Inserting CVEs...")
        await database.cves.insert_many(cves_data)
        
        print("Database seeded successfully!")
        
        client.close()
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(seed_database())
