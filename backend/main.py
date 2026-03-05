from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from context.database import connect_to_mongo, close_mongo_connection
# Existing routers
from routes.threat_actors import router as threat_actors_router
from routes.iocs import router as iocs_router
from routes.malware_families import router as malware_families_router
from routes.cves import router as cves_router

# ✅ ADD THIS IMPORT
import routes.auth
print("🔥 IMPORTED:", routes.auth.__file__)
from routes.auth import router as auth_router

app = FastAPI(
    title="Orchids Threat Intelligence API",
    version="1.0.0"
)

# ✅ Update CORS (allow both ports)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database events
app.add_event_handler("startup", connect_to_mongo)
app.add_event_handler("shutdown", close_mongo_connection)

# Include routers
app.include_router(auth_router)
app.include_router(threat_actors_router)
app.include_router(iocs_router)
app.include_router(malware_families_router)
app.include_router(cves_router) 

@app.get("/")
async def root():
    return {"message": "Orchids Threat Intelligence API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}