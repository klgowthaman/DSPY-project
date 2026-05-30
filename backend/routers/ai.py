"""AI query router — SSE streaming DSPy agent endpoint."""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from datetime import datetime
from typing import Optional
import logging

from auth import get_current_user
from database import get_collection
from agents.dspy_agent import run_agent_query
from schemas.ai import QueryRequest

router = APIRouter(prefix="/ai", tags=["ai"])
logger = logging.getLogger(__name__)

def _decrypt_token(encrypted_token: str) -> str:
    if not encrypted_token:
        return ""
    try:
        from cryptography.fernet import Fernet
        from config import settings
        import base64
        key = settings.encryption_key.encode()
        key = base64.urlsafe_b64encode(key.ljust(32)[:32])
        f = Fernet(key)
        return f.decrypt(encrypted_token.encode()).decode()
    except Exception:
        import base64
        try:
            return base64.b64decode(encrypted_token.encode()).decode()
        except:
            return ""



@router.post("/query")
async def query_agent(
    body: QueryRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Stream an AI response from the DSPy Multi-Hop ReAct Agent.
    Returns Server-Sent Events (SSE) with reasoning steps and answer tokens.
    """
    if not body.question or not body.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    workspace_id = current_user.get("workspace_id", "demo-workspace")
    workspace_name = ""

    # Fetch workspace name from DB
    workspaces = get_collection("workspaces")
    if workspaces is not None:
        try:
            from bson import ObjectId
            ws = await workspaces.find_one({"_id": ObjectId(workspace_id)})
            if ws:
                workspace_name = ws.get("name", "")
        except Exception:
            pass

    github_token = ""
    repo_url = ""
    llm_api_key = None

    if body.project_id:
        projects = get_collection("projects")
        if projects is not None:
            try:
                from bson import ObjectId
                project_doc = await projects.find_one({"_id": ObjectId(body.project_id)})
                if project_doc:
                    repo_url = project_doc.get("repo_url", "")
                    enc_token = project_doc.get("github_token_encrypted")
                    if enc_token:
                        github_token = _decrypt_token(enc_token)
                    enc_llm_token = project_doc.get("llm_api_key_encrypted")
                    if enc_llm_token:
                        llm_api_key = _decrypt_token(enc_llm_token)
            except Exception as e:
                logger.error(f"Error fetching project: {e}")

    # Save query to history
    query_history = get_collection("query_history")
    if query_history is not None:
        await query_history.insert_one({
            "question": body.question,
            "workspace_id": workspace_id,
            "user_id": current_user.get("sub"),
            "project_id": body.project_id,
            "timestamp": datetime.utcnow().isoformat(),
        })

    async def generate():
        async for chunk in run_agent_query(
            question=body.question,
            workspace_id=workspace_id,
            workspace_name=workspace_name,
            github_token=github_token,
            repo_url=repo_url,
            llm_api_key=llm_api_key,
        ):
            yield chunk

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


@router.get("/history")
async def get_query_history(current_user: dict = Depends(get_current_user)):
    """Get query history for the current workspace."""
    query_history = get_collection("query_history")

    if query_history is None:
        return {"history": _mock_history()}

    cursor = query_history.find(
        {"workspace_id": current_user.get("workspace_id")},
        sort=[("timestamp", -1)],
    ).limit(50)

    docs = await cursor.to_list(length=50)
    result = []
    for doc in docs:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        result.append(doc)

    return {"history": result or _mock_history()}


def _mock_history():
    return [
        {"id": "h1", "question": "Why does order-service use polling instead of webhooks?", "timestamp": "2025-05-27T10:00:00"},
        {"id": "h2", "question": "Why is payment-service using retry queues?", "timestamp": "2025-05-27T09:45:00"},
        {"id": "h3", "question": "What caused the auth-gateway migration?", "timestamp": "2025-05-26T16:30:00"},
    ]
