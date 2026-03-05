# Orchids Threat Intelligence Backend

FastAPI backend with MongoDB for the Orchids Threat Intelligence Dashboard.

## Setup Instructions

### Prerequisites
- Python 3.8+
- MongoDB (local or MongoDB Atlas)
- Node.js (for frontend)

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Set up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
# Ubuntu/Debian:
sudo apt-get install mongodb

# macOS with Homebrew:
brew install mongodb-community

# Start MongoDB
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string from the Atlas dashboard
4. Update `.env` file with your connection string

### 3. Configure Environment

Copy the `.env` file and update if needed:

```bash
# For local MongoDB
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=orchids_threat_intel

# For MongoDB Atlas (replace with your connection string)
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/
```

### 4. Seed the Database

```bash
python seed_data.py
```

This will populate the database with the demo threat intelligence data.

### 5. Run the Backend Server

```bash
python main.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Threat Actors
- `GET /api/threat-actors/` - Get all threat actors
- `GET /api/threat-actors/{id}` - Get specific threat actor
- `GET /api/threat-actors/category/{category}` - Filter by category
- `GET /api/threat-actors/status/{status}` - Filter by status

### IOCs (Indicators of Compromise)
- `GET /api/iocs/` - Get all IOCs
- `GET /api/iocs/search?q={query}` - Search IOCs by value
- `GET /api/iocs/{id}` - Get specific IOC
- `GET /api/iocs/type/{type}` - Filter by type (IP, Domain, Hash, URL)

### Malware Families
- `GET /api/malware-families/` - Get all malware families
- `GET /api/malware-families/{id}` - Get specific malware family
- `GET /api/malware-families/type/{type}` - Filter by type

### CVEs
- `GET /api/cves/` - Get all CVEs
- `GET /api/cves/{id}` - Get specific CVE
- `GET /api/cves/severity/{severity}` - Filter by severity

### Utility
- `GET /` - API info
- `GET /health` - Health check

## API Documentation

Once the server is running, visit:
- `http://localhost:8000/docs` - Interactive API docs (Swagger)
- `http://localhost:8000/redoc` - ReDoc documentation

## Frontend Integration

The frontend is configured to connect to this backend via the `NEXT_PUBLIC_API_URL` environment variable. Make sure this is set to `http://localhost:8000` in your frontend `.env.local` file.

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running (`sudo systemctl status mongod`)
- Check if the connection string in `.env` is correct
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Conflicts
- If port 8000 is in use, change it: `uvicorn main:app --port 8001`
- Update frontend API URL accordingly

### Import Errors
- Make sure you're in the backend directory
- Install all requirements: `pip install -r requirements.txt`
