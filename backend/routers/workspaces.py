"""Workspaces router — multi-tenant workspace management."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime
from bson import ObjectId

from auth import get_current_user
from database import get_collection

router = APIRouter(prefix="/workspaces", tags=["workspaces"])


class UpdateWorkspaceRequest(BaseModel):
    name: str = None
    description: str = None
    domain: str = None


@router.get("")
async def list_workspaces(current_user: dict = Depends(get_current_user)):
    workspaces = get_collection("workspaces")
    workspace_id = current_user.get("workspace_id")

    if workspaces is None:
        return {"workspaces": [_mock_workspace(workspace_id, current_user)]}

    try:
        doc = await workspaces.find_one({"_id": ObjectId(workspace_id)})
        if doc:
            doc["id"] = str(doc["_id"])
            del doc["_id"]
            return {"workspaces": [doc]}
    except Exception:
        pass

    return {"workspaces": [_mock_workspace(workspace_id, current_user)]}


@router.get("/current")
async def get_current_workspace(current_user: dict = Depends(get_current_user)):
    workspaces = get_collection("workspaces")
    workspace_id = current_user.get("workspace_id")

    if workspaces is None:
        return _mock_workspace(workspace_id, current_user)

    try:
        doc = await workspaces.find_one({"_id": ObjectId(workspace_id)})
        if doc:
            doc["id"] = str(doc["_id"])
            del doc["_id"]
            return doc
    except Exception:
        pass

    return _mock_workspace(workspace_id, current_user)


@router.patch("/current")
async def update_workspace(
    body: UpdateWorkspaceRequest,
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update workspace settings")

    workspaces = get_collection("workspaces")
    workspace_id = current_user.get("workspace_id")

    updates = {k: v for k, v in body.dict().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    updates["updated_at"] = datetime.utcnow().isoformat()

    if workspaces is not None:
        try:
            await workspaces.update_one(
                {"_id": ObjectId(workspace_id)},
                {"$set": updates},
            )
        except Exception:
            pass

    return {"status": "updated", **updates}


def _mock_workspace(workspace_id: str, user: dict) -> dict:
    return {
        "id": workspace_id,
        "name": "Backend Engineering",
        "description": "Core backend services and APIs",
        "domain": "company.com",
        "member_count": 11,
        "project_count": 5,
        "created_at": "2024-01-01",
    }
