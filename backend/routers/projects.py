"""Projects router — CRUD for workspace projects."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from bson import ObjectId

from auth import get_current_user
from database import get_collection

router = APIRouter(prefix="/projects", tags=["projects"])

MOCK_PROJECTS = [
    {"id": "p1", "name": "order-service", "description": "Core order processing microservice", "language": "Go", "stars": 47, "last_activity": "2 hours ago", "status": "healthy", "pr_count": 8, "jira_count": 23, "slack_activity": 156},
    {"id": "p2", "name": "payment-service", "description": "Payment processing with retry queues", "language": "Python", "stars": 32, "last_activity": "4 hours ago", "status": "warning", "pr_count": 3, "jira_count": 12, "slack_activity": 89},
    {"id": "p3", "name": "auth-gateway", "description": "JWT-based authentication service", "language": "TypeScript", "stars": 61, "last_activity": "1 day ago", "status": "healthy", "pr_count": 5, "jira_count": 18, "slack_activity": 234},
    {"id": "p4", "name": "notification-hub", "description": "Multi-channel notification dispatch", "language": "Python", "stars": 28, "last_activity": "3 days ago", "status": "critical", "pr_count": 1, "jira_count": 7, "slack_activity": 45},
    {"id": "p5", "name": "data-pipeline", "description": "ETL pipeline for analytics", "language": "Python", "stars": 19, "last_activity": "6 hours ago", "status": "healthy", "pr_count": 12, "jira_count": 31, "slack_activity": 312},
]


class CreateProjectRequest(BaseModel):
    name: str
    description: str = ""
    language: str = "Python"
    repo_url: str = ""


@router.get("")
async def list_projects(current_user: dict = Depends(get_current_user)):
    workspace_id = current_user.get("workspace_id", "")
    projects = get_collection("projects")

    if projects is None:
        return {"projects": MOCK_PROJECTS, "source": "mock"}

    cursor = projects.find({"workspace_id": workspace_id})
    docs = await cursor.to_list(length=100)
    result = []
    for doc in docs:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        result.append(doc)

    return {"projects": result or MOCK_PROJECTS, "source": "db" if result else "mock"}


@router.get("/{project_id}")
async def get_project(project_id: str, current_user: dict = Depends(get_current_user)):
    projects = get_collection("projects")

    if projects is None:
        proj = next((p for p in MOCK_PROJECTS if p["id"] == project_id), MOCK_PROJECTS[0])
        return proj

    try:
        doc = await projects.find_one({
            "_id": ObjectId(project_id),
            "workspace_id": current_user.get("workspace_id"),
        })
    except Exception:
        doc = None

    if not doc:
        proj = next((p for p in MOCK_PROJECTS if p["id"] == project_id), None)
        if proj:
            return proj
        raise HTTPException(status_code=404, detail="Project not found")

    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc


@router.post("", status_code=201)
async def create_project(
    body: CreateProjectRequest,
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") not in ("admin",):
        raise HTTPException(status_code=403, detail="Only admins can create projects")

    projects = get_collection("projects")

    project_doc = {
        "name": body.name,
        "description": body.description,
        "language": body.language,
        "repo_url": body.repo_url,
        "workspace_id": current_user.get("workspace_id"),
        "created_by": current_user.get("sub"),
        "status": "healthy",
        "stars": 0,
        "pr_count": 0,
        "jira_count": 0,
        "slack_activity": 0,
        "last_activity": "just now",
        "created_at": datetime.utcnow().isoformat(),
    }

    if projects is None:
        return {"id": "new-mock-id", **project_doc}

    result = await projects.insert_one(project_doc)
    project_doc["id"] = str(result.inserted_id)
    return project_doc


@router.delete("/{project_id}", status_code=204)
async def delete_project(project_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Only admins can delete projects")

    projects = get_collection("projects")
    if projects is None:
        return

    try:
        await projects.delete_one({
            "_id": ObjectId(project_id),
            "workspace_id": current_user.get("workspace_id"),
        })
    except Exception:
        pass
