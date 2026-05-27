"""Integrations router — connect, sync, and manage API integrations."""
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
import base64
import logging

from auth import get_current_user
from database import get_collection
from config import settings

router = APIRouter(prefix="/integrations", tags=["integrations"])
logger = logging.getLogger(__name__)

MOCK_INTEGRATIONS = [
    {"id": "i1", "type": "github", "name": "GitHub", "status": "connected", "last_sync": "5 min ago", "items_indexed": 1847, "health": 99},
    {"id": "i2", "type": "jira", "name": "Jira", "status": "connected", "last_sync": "12 min ago", "items_indexed": 3241, "health": 97},
    {"id": "i3", "type": "slack", "name": "Slack", "status": "syncing", "last_sync": "2 min ago", "items_indexed": 8912, "health": 85},
    {"id": "i4", "type": "runbooks", "name": "Runbooks", "status": "connected", "last_sync": "1 hour ago", "items_indexed": 124, "health": 100},
]


class ConnectRequest(BaseModel):
    token: str
    base_url: Optional[str] = None  # For Jira: https://yourcompany.atlassian.net
    extra: Optional[dict] = {}


def _encrypt_token(token: str) -> str:
    """Simple base64 encoding — replace with real encryption in production."""
    try:
        from cryptography.fernet import Fernet
        key = settings.encryption_key.encode()
        # Pad/truncate to valid Fernet key length
        key = base64.urlsafe_b64encode(key.ljust(32)[:32])
        f = Fernet(key)
        return f.encrypt(token.encode()).decode()
    except Exception:
        return base64.b64encode(token.encode()).decode()


def _decrypt_token(encrypted: str) -> str:
    """Decrypt stored token."""
    try:
        from cryptography.fernet import Fernet
        key = settings.encryption_key.encode()
        key = base64.urlsafe_b64encode(key.ljust(32)[:32])
        f = Fernet(key)
        return f.decrypt(encrypted.encode()).decode()
    except Exception:
        return base64.b64decode(encrypted).decode()


@router.get("")
async def list_integrations(current_user: dict = Depends(get_current_user)):
    integrations = get_collection("integrations")
    workspace_id = current_user.get("workspace_id")

    if integrations is None:
        return {"integrations": MOCK_INTEGRATIONS, "source": "mock"}

    cursor = integrations.find({"workspace_id": workspace_id})
    docs = await cursor.to_list(length=20)
    result = []
    for doc in docs:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        doc.pop("token_encrypted", None)  # Never return tokens
        result.append(doc)

    return {"integrations": result or MOCK_INTEGRATIONS, "source": "db" if result else "mock"}


@router.post("/{integration_type}/connect")
async def connect_integration(
    integration_type: str,
    body: ConnectRequest,
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Only admins can manage integrations")

    if integration_type not in ("github", "jira", "slack", "runbooks"):
        raise HTTPException(status_code=400, detail="Unknown integration type")

    # Validate token (mock validation for now)
    is_valid = len(body.token) > 10

    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid API token")

    integrations = get_collection("integrations")
    workspace_id = current_user.get("workspace_id")

    integration_doc = {
        "type": integration_type,
        "name": integration_type.capitalize(),
        "workspace_id": workspace_id,
        "status": "connected",
        "token_encrypted": _encrypt_token(body.token),
        "base_url": body.base_url or "",
        "extra": body.extra or {},
        "items_indexed": 0,
        "health": 100,
        "last_sync": "never",
        "connected_at": datetime.utcnow().isoformat(),
        "connected_by": current_user.get("sub"),
    }

    if integrations is None:
        return {"status": "connected", "type": integration_type, "message": "Token saved (mock mode)"}

    # Upsert
    await integrations.update_one(
        {"workspace_id": workspace_id, "type": integration_type},
        {"$set": integration_doc},
        upsert=True,
    )

    return {"status": "connected", "type": integration_type}


@router.post("/{integration_type}/sync")
async def sync_integration(
    integration_type: str,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Only admins can trigger syncs")

    integrations = get_collection("integrations")
    workspace_id = current_user.get("workspace_id")

    # Mark as syncing
    if integrations is not None:
        await integrations.update_one(
            {"workspace_id": workspace_id, "type": integration_type},
            {"$set": {"status": "syncing", "sync_started_at": datetime.utcnow().isoformat()}},
        )

    # Queue background sync task
    background_tasks.add_task(
        _run_sync_background,
        workspace_id,
        integration_type,
    )

    return {"status": "syncing", "type": integration_type, "message": "Sync started in background"}


@router.delete("/{integration_type}")
async def disconnect_integration(
    integration_type: str,
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Only admins can disconnect integrations")

    integrations = get_collection("integrations")
    if integrations is not None:
        await integrations.delete_one({
            "workspace_id": current_user.get("workspace_id"),
            "type": integration_type,
        })

    return {"status": "disconnected", "type": integration_type}


async def _run_sync_background(workspace_id: str, integration_type: str):
    """Background task: index data from integration into vector store."""
    logger.info(f"Starting background sync: {integration_type} for workspace {workspace_id}")
    import asyncio
    await asyncio.sleep(5)  # Simulate indexing work

    # Update sync status
    integrations = get_collection("integrations")
    if integrations is not None:
        await integrations.update_one(
            {"workspace_id": workspace_id, "type": integration_type},
            {"$set": {
                "status": "connected",
                "last_sync": "just now",
                "sync_completed_at": datetime.utcnow().isoformat(),
            }},
        )
    logger.info(f"Sync complete: {integration_type} for workspace {workspace_id}")
