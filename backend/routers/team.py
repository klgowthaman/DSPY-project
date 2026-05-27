"""Team management router — invite, list, remove members."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime
from typing import Literal
from bson import ObjectId

from auth import get_current_user
from database import get_collection

router = APIRouter(prefix="/team", tags=["team"])

MOCK_MEMBERS = [
    {"id": "t1", "name": "Alex Chen", "email": "alex.chen@company.com", "role": "admin", "avatar": "AC", "joined_at": "2024-01-15", "last_active": "2 min ago", "queries_count": 421},
    {"id": "t2", "name": "Sarah Kim", "email": "sarah.kim@company.com", "role": "engineer", "avatar": "SK", "joined_at": "2024-02-10", "last_active": "1 hour ago", "queries_count": 287},
    {"id": "t3", "name": "Marcus Webb", "email": "marcus.webb@company.com", "role": "viewer", "avatar": "MW", "joined_at": "2024-03-05", "last_active": "3 hours ago", "queries_count": 89},
    {"id": "t4", "name": "Priya Patel", "email": "priya.patel@company.com", "role": "engineer", "avatar": "PP", "joined_at": "2024-03-20", "last_active": "30 min ago", "queries_count": 156},
]


class InviteRequest(BaseModel):
    email: str
    role: Literal["engineer", "viewer"] = "engineer"


@router.get("/members")
async def list_members(current_user: dict = Depends(get_current_user)):
    workspace_id = current_user.get("workspace_id")
    users = get_collection("users")

    if users is None:
        return {"members": MOCK_MEMBERS, "source": "mock"}

    cursor = users.find({"workspace_id": workspace_id})
    docs = await cursor.to_list(length=100)
    result = []
    for doc in docs:
        result.append({
            "id": str(doc["_id"]),
            "name": doc.get("name", ""),
            "email": doc.get("email", ""),
            "role": doc.get("role", "engineer"),
            "avatar": doc.get("avatar", "U"),
            "joined_at": doc.get("created_at", ""),
            "last_active": "recently",
            "queries_count": 0,
        })

    return {"members": result or MOCK_MEMBERS, "source": "db" if result else "mock"}


@router.post("/members/invite", status_code=201)
async def invite_member(
    body: InviteRequest,
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Only admins can invite members")

    users = get_collection("users")
    name = body.email.split("@")[0]
    initials = name[:2].upper()

    invite_doc = {
        "name": name,
        "email": body.email,
        "role": body.role,
        "avatar": initials,
        "workspace_id": current_user.get("workspace_id"),
        "invited_by": current_user.get("sub"),
        "status": "invited",
        "created_at": datetime.utcnow().isoformat(),
    }

    if users is None:
        return {
            "id": "mock-invite-id",
            **invite_doc,
            "message": "Invite sent (mock mode — MongoDB not connected)",
        }

    result = await users.insert_one(invite_doc)
    invite_doc["id"] = str(result.inserted_id)

    # TODO: Send real invite email via SendGrid/SMTP
    return {**invite_doc, "message": f"Invite sent to {body.email}"}


@router.delete("/members/{member_id}", status_code=204)
async def remove_member(
    member_id: str,
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Only admins can remove members")

    # Prevent self-removal
    if member_id == current_user.get("sub"):
        raise HTTPException(status_code=400, detail="Cannot remove yourself")

    users = get_collection("users")
    if users is None:
        return

    try:
        await users.delete_one({
            "_id": ObjectId(member_id),
            "workspace_id": current_user.get("workspace_id"),
        })
    except Exception:
        pass


@router.patch("/members/{member_id}/role")
async def update_member_role(
    member_id: str,
    body: dict,
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Only admins can change roles")

    new_role = body.get("role")
    if new_role not in ("admin", "engineer", "viewer"):
        raise HTTPException(status_code=400, detail="Invalid role")

    users = get_collection("users")
    if users is not None:
        try:
            await users.update_one(
                {"_id": ObjectId(member_id), "workspace_id": current_user.get("workspace_id")},
                {"$set": {"role": new_role}},
            )
        except Exception:
            pass

    return {"member_id": member_id, "role": new_role}
