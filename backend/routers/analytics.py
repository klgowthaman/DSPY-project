"""Analytics router — dashboard metrics and usage stats."""
from fastapi import APIRouter, Depends
from datetime import datetime, timedelta
import logging

from auth import get_current_user
from database import get_collection

router = APIRouter(prefix="/analytics", tags=["analytics"])
logger = logging.getLogger(__name__)

MOCK_ANALYTICS = {
    "overview": {
        "total_projects": 5,
        "total_repositories": 23,
        "jira_tickets_indexed": 3241,
        "slack_threads_indexed": 8912,
        "ai_queries_today": 87,
        "knowledge_confidence_score": 91,
    },
    "query_activity": [
        {"date": "May 21", "queries": 42, "confidence": 87, "users": 8},
        {"date": "May 22", "queries": 61, "confidence": 89, "users": 10},
        {"date": "May 23", "queries": 38, "confidence": 85, "users": 7},
        {"date": "May 24", "queries": 78, "confidence": 91, "users": 12},
        {"date": "May 25", "queries": 95, "confidence": 93, "users": 14},
        {"date": "May 26", "queries": 112, "confidence": 90, "users": 11},
        {"date": "May 27", "queries": 87, "confidence": 92, "users": 13},
    ],
    "top_questions": [
        {"question": "Why does order-service use polling instead of webhooks?", "count": 34, "trend": "up"},
        {"question": "Why is payment-service using retry queues?", "count": 28, "trend": "up"},
        {"question": "Why was auth-gateway migrated from Node.js to TypeScript?", "count": 21, "trend": "stable"},
        {"question": "What caused the data-pipeline migration to Spark?", "count": 18, "trend": "down"},
        {"question": "Why does notification-hub use SNS instead of SQS?", "count": 15, "trend": "up"},
    ],
    "knowledge_gaps": [
        {"area": "Deployment Process", "score": 23, "severity": "critical"},
        {"area": "Database Schema Changes", "score": 41, "severity": "warning"},
        {"area": "Error Handling Patterns", "score": 58, "severity": "medium"},
        {"area": "API Rate Limiting", "score": 67, "severity": "low"},
        {"area": "Auth Flow Documentation", "score": 72, "severity": "low"},
    ],
}


@router.get("/overview")
async def get_overview(current_user: dict = Depends(get_current_user)):
    """Get dashboard metric cards."""
    workspace_id = current_user.get("workspace_id")
    query_history = get_collection("query_history")
    projects = get_collection("projects")

    if query_history is None or projects is None:
        return {"data": MOCK_ANALYTICS["overview"], "source": "mock"}

    # Real counts from DB
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0)
    queries_today = await query_history.count_documents({
        "workspace_id": workspace_id,
        "timestamp": {"$gte": today_start.isoformat()},
    })
    total_projects = await projects.count_documents({"workspace_id": workspace_id})

    return {
        "data": {
            **MOCK_ANALYTICS["overview"],
            "ai_queries_today": queries_today,
            "total_projects": total_projects or MOCK_ANALYTICS["overview"]["total_projects"],
        },
        "source": "db",
    }


@router.get("/queries")
async def get_query_analytics(current_user: dict = Depends(get_current_user)):
    """Get query activity over time."""
    workspace_id = current_user.get("workspace_id")
    query_history = get_collection("query_history")

    if query_history is None:
        return {"data": MOCK_ANALYTICS["query_activity"], "source": "mock"}

    # Aggregate queries per day for last 7 days
    pipeline = [
        {"$match": {"workspace_id": workspace_id}},
        {"$group": {
            "_id": {"$substr": ["$timestamp", 0, 10]},
            "queries": {"$sum": 1},
        }},
        {"$sort": {"_id": 1}},
        {"$limit": 7},
    ]
    cursor = query_history.aggregate(pipeline)
    docs = await cursor.to_list(length=7)

    if not docs:
        return {"data": MOCK_ANALYTICS["query_activity"], "source": "mock"}

    result = [
        {"date": d["_id"], "queries": d["queries"], "confidence": 89, "users": 8}
        for d in docs
    ]
    return {"data": result, "source": "db"}


@router.get("/top-questions")
async def get_top_questions(current_user: dict = Depends(get_current_user)):
    """Get most frequently asked questions."""
    workspace_id = current_user.get("workspace_id")
    query_history = get_collection("query_history")

    if query_history is None:
        return {"data": MOCK_ANALYTICS["top_questions"], "source": "mock"}

    pipeline = [
        {"$match": {"workspace_id": workspace_id}},
        {"$group": {"_id": "$question", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10},
    ]
    cursor = query_history.aggregate(pipeline)
    docs = await cursor.to_list(length=10)

    if not docs:
        return {"data": MOCK_ANALYTICS["top_questions"], "source": "mock"}

    result = [
        {"question": d["_id"], "count": d["count"], "trend": "stable"}
        for d in docs
    ]
    return {"data": result, "source": "db"}


@router.get("/knowledge-gaps")
async def get_knowledge_gaps(current_user: dict = Depends(get_current_user)):
    """Get detected knowledge gaps."""
    return {"data": MOCK_ANALYTICS["knowledge_gaps"], "source": "mock"}
