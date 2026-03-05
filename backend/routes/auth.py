from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from context.database import get_database
from models.user import UserLogin, Token
from utils.auth import verify_password, create_access_token, verify_token

router = APIRouter(prefix="/api/auth", tags=["authentication"])


@router.post("/login", response_model=Token)
async def login(login_data: UserLogin):
    db = get_database()

    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database not connected"
        )

    users_collection = db["users"]

    user = await users_collection.find_one({"email": login_data.email})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not verify_password(login_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account deactivated"
        )

    # Update last login
    await users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login": datetime.utcnow()}}
    )

    access_token = create_access_token({"sub": user["email"]})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": 3600
    }


@router.get("/me")
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer())):
    db = get_database()
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database not connected"
        )

    # Verify token
    email = verify_token(credentials.credentials)
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

    # Get user from database
    users_collection = db["users"]
    user = await users_collection.find_one({"email": email})
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    # Convert ObjectId to string and remove sensitive data
    user_data = {
        "id": str(user["_id"]),
        "username": user.get("username", ""),
        "email": user["email"],
        "company_name": user.get("company_name", ""),
        "company_website": user.get("company_website", ""),
        "is_active": user.get("is_active", True),
        "is_verified": user.get("is_verified", False),
        "is_admin": user.get("is_admin", False),
        "created_at": user.get("created_at", ""),
        "last_login": user.get("last_login", "")
    }
    
    return user_data


@router.post("/logout")
async def logout():
    return {"message": "Successfully logged out"}