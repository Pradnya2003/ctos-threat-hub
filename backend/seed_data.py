import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os
from bson import ObjectId

# Load environment variables
load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "orchids_threat_intel")

# Demo data matching the frontend
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
    },
    {
        "_id": str(ObjectId()),
        "name": "Fancy Bear",
        "category": "APT",
        "status": "Active",
        "description": "A Russian cyberespionage group associated with the GRU, active since the mid-2000s.",
        "profileImage": "https://app.foresiet.com/img/35.4ab0d7de.png",
        "targetedCountries": ["USA", "Germany", "Ukraine", "Georgia"],
        "associatedMalware": ["X-Agent", "Sednit"],
        "lastUpdated": "2026-02-10"
    },
    {
        "_id": str(ObjectId()),
        "name": "Wizard Spider",
        "category": "Ransomware",
        "status": "Active",
        "description": "A Russia-based cybercriminal group behind Ryuk, Conti, and TrickBot.",
        "profileImage": "https://app.foresiet.com/img/21.f53b6bbd.png",
        "targetedCountries": ["Global"],
        "associatedMalware": ["Ryuk", "Conti", "TrickBot"],
        "lastUpdated": "2026-02-25"
    },
    {
        "_id": str(ObjectId()),
        "name": "MuddyWater",
        "category": "APT",
        "status": "Emerging",
        "description": "An Iranian threat actor group primarily targeting Middle Eastern nations.",
        "profileImage": "https://app.foresiet.com/img/23.3e2ac0a2.png",
        "targetedCountries": ["Saudi Arabia", "UAE", "Israel", "Turkey"],
        "associatedMalware": ["POWERSTATS", "Small Sieve"],
        "lastUpdated": "2026-02-22"
    },
    {
        "_id": str(ObjectId()),
        "name": "CL0P",
        "category": "Ransomware",
        "status": "Active",
        "description": "A financially motivated threat actor group known for large-scale data theft and extortion.",
        "profileImage": "https://app.foresiet.com/img/16.8933de94.png",
        "targetedCountries": ["USA", "UK", "Australia", "Japan"],
        "associatedMalware": ["CL0P Ransomware", "TrueBot"],
        "lastUpdated": "2026-02-24"
    },
    {
        "_id": str(ObjectId()),
        "name": "BlackCat",
        "category": "Ransomware",
        "status": "Active",
        "description": "Also known as ALPHV, a sophisticated RaaS group utilizing Rust-based malware.",
        "profileImage": "https://app.foresiet.com/img/13.aaec0135.png",
        "targetedCountries": ["Global"],
        "associatedMalware": ["ALPHV", "Exmatter"],
        "lastUpdated": "2026-02-18"
    },
    {
        "_id": str(ObjectId()),
        "name": "RedEcho",
        "category": "APT",
        "status": "Inactive",
        "description": "A Chinese state-sponsored group targeting critical infrastructure in India.",
        "profileImage": "https://app.foresiet.com/img/17.6a68f36f.png",
        "targetedCountries": ["India"],
        "associatedMalware": ["ShadowPad"],
        "lastUpdated": "2025-12-01"
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
        "id": "CVE-2024-21413",
        "title": "Microsoft Outlook Remote Code Execution Vulnerability",
        "severity": "Critical"
    },
    {
        "_id": str(ObjectId()),
        "id": "CVE-2023-46604",
        "title": "Apache ActiveMQ Remote Code Execution",
        "severity": "Critical"
    },
    {
        "_id": str(ObjectId()),
        "id": "CVE-2024-38063",
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
    },
    {
        "_id": str(ObjectId()),
        "value": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "type": "Hash",
        "firstSeen": "2026-02-01",
        "lastSeen": "2026-02-25"
    }
]

async def seed_database():
    """Seed the database with demo data"""
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient(MONGODB_URL, server_api=ServerApi('1'))
        database = client[DATABASE_NAME]
        
        print(f"Connected to MongoDB at {MONGODB_URL}")
        print(f"Using database: {DATABASE_NAME}")
        
        # Clear existing data
        print("Clearing existing data...")
        await database.threat_actors.delete_many({})
        await database.malware_families.delete_many({})
        await database.cves.delete_many({})
        await database.iocs.delete_many({})
        
        # Insert demo data
        print("Inserting threat actors...")
        await database.threat_actors.insert_many(threat_actors_data)
        
        print("Inserting malware families...")
        await database.malware_families.insert_many(malware_families_data)
        
        print("Inserting CVEs...")
        await database.cves.insert_many(cves_data)
        
        print("Inserting IOCs...")
        await database.iocs.insert_many(iocs_data)
        
        print("Database seeded successfully!")
        
        # Verify data was inserted
        threat_actors_count = await database.threat_actors.count_documents({})
        malware_families_count = await database.malware_families.count_documents({})
        cves_count = await database.cves.count_documents({})
        iocs_count = await database.iocs.count_documents({})
        
        print(f"Inserted {threat_actors_count} threat actors")
        print(f"Inserted {malware_families_count} malware families")
        print(f"Inserted {cves_count} CVEs")
        print(f"Inserted {iocs_count} IOCs")
        
        client.close()
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(seed_database())
