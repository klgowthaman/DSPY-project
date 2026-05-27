"""Auth router — login and signup endpoints."""
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from datetime import datetime
from bson import ObjectId
import logging

from auth import hash_password, verify_password, create_access_token, get_current_user
from database import get_collection

router = APIRouter(prefix="/auth", tags=["auth"])
logger = logging.getLogger(__name__)


class LoginRequest(BaseModel):
    email: str
    password: str


class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    company: str = ""
    workspace_name: str = "My Workspace"


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


# -------------------------------------------------------
# POST /auth/signup
# -------------------------------------------------------
@router.post("/signup", response_model=TokenResponse, status_code=201)
async def signup(body: SignupRequest):
    users = get_collection("users")
    workspaces = get_collection("workspaces")

    if users is None:
        # DB not available — return mock token
        return _mock_token_response(body.email, body.name, "admin")

    # Check duplicate email
    existing = await users.find_one({"email": body.email})
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    # Create workspace
    workspace_doc = {
        "name": body.workspace_name,
        "description": f"{body.company} engineering workspace",
        "company": body.company,
        "created_at": datetime.utcnow().isoformat(),
        "member_count": 1,
        "project_count": 0,
    }
    ws_result = await workspaces.insert_one(workspace_doc)
    workspace_id = str(ws_result.inserted_id)

    # Create user
    user_doc = {
        "name": body.name,
        "email": body.email,
        "password_hash": hash_password(body.password),
        "role": "admin",
        "avatar": body.name[:2].upper(),
        "workspace_id": workspace_id,
        "created_at": datetime.utcnow().isoformat(),
    }
    result = await users.insert_one(user_doc)
    user_id = str(result.inserted_id)

    token = create_access_token({
        "sub": user_id,
        "email": body.email,
        "role": "admin",
        "workspace_id": workspace_id,
        "name": body.name,
        "avatar": body.name[:2].upper(),
    })

    return {
        "access_token": token,
        "user": {
            "id": user_id,
            "name": body.name,
            "email": body.email,
            "role": "admin",
            "avatar": body.name[:2].upper(),
            "workspace_id": workspace_id,
        },
    }


# -------------------------------------------------------
# POST /auth/login
# -------------------------------------------------------
@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest):
    users = get_collection("users")

    if users is None:
        # DB not available — accept any credentials for demo
        return _mock_token_response(body.email, body.email.split("@")[0], "admin")

    user = await users.find_one({"email": body.email})
    if not user or not verify_password(body.password, user.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    user_id = str(user["_id"])
    token = create_access_token({
        "sub": user_id,
        "email": user["email"],
        "role": user.get("role", "engineer"),
        "workspace_id": user.get("workspace_id", ""),
        "name": user.get("name", ""),
        "avatar": user.get("avatar", "U"),
    })

    return {
        "access_token": token,
        "user": {
            "id": user_id,
            "name": user.get("name"),
            "email": user["email"],
            "role": user.get("role", "engineer"),
            "avatar": user.get("avatar", "U"),
            "workspace_id": user.get("workspace_id", ""),
        },
    }


# -------------------------------------------------------
# GET /auth/me
# -------------------------------------------------------
@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user


# -------------------------------------------------------
# Helpers
# -------------------------------------------------------
def _mock_token_response(email: str, name: str, role: str) -> dict:
    """Return a mock token when DB is unavailable."""
    token = create_access_token({
        "sub": "demo-user-id",
        "email": email,
        "role": role,
        "workspace_id": "demo-workspace",
        "name": name or email.split("@")[0],
        "avatar": (name or email)[:2].upper(),
    })
    return {
        "access_token": token,
        "user": {
            "id": "demo-user-id",
            "name": name or email.split("@")[0],
            "email": email,
            "role": role,
            "avatar": (name or email)[:2].upper(),
            "workspace_id": "demo-workspace",
        },
    }
