"""
ChromaDB vector store client for semantic search.
Falls back gracefully if ChromaDB is not running.
"""
import logging
from typing import List, Dict, Any, Optional
from config import settings

logger = logging.getLogger(__name__)

chroma_client = None
collection = None


def init_vector_store():
    """Initialize ChromaDB client. Fails gracefully if unavailable."""
    global chroma_client, collection
    try:
        import chromadb
        chroma_client = chromadb.HttpClient(
            host=settings.chromadb_host,
            port=settings.chromadb_port,
        )
        chroma_client.heartbeat()
        collection = chroma_client.get_or_create_collection(
            name=settings.chromadb_collection,
            metadata={"hnsw:space": "cosine"},
        )
        logger.info(f"✅ Connected to ChromaDB at {settings.chromadb_host}:{settings.chromadb_port}")
    except Exception as e:
        logger.warning(f"⚠️  ChromaDB not available: {e}. Vector search will use fallback.")
        chroma_client = None
        collection = None


def add_documents(
    documents: List[str],
    metadatas: List[Dict[str, Any]],
    ids: List[str],
    workspace_id: str,
) -> bool:
    """Add documents to the vector store with workspace namespace."""
    if collection is None:
        return False
    try:
        # Prefix IDs with workspace_id for isolation
        prefixed_ids = [f"{workspace_id}::{id}" for id in ids]
        enriched_meta = [{**m, "workspace_id": workspace_id} for m in metadatas]
        collection.add(
            documents=documents,
            metadatas=enriched_meta,
            ids=prefixed_ids,
        )
        return True
    except Exception as e:
        logger.error(f"Error adding documents to vector store: {e}")
        return False


def semantic_search(
    query: str,
    workspace_id: str,
    n_results: int = 10,
    source_filter: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """Search for relevant documents in the workspace namespace."""
    if collection is None:
        return _mock_search_results(query)

    try:
        where = {"workspace_id": {"$eq": workspace_id}}
        if source_filter:
            where = {
                "$and": [
                    {"workspace_id": {"$eq": workspace_id}},
                    {"source": {"$eq": source_filter}},
                ]
            }

        results = collection.query(
            query_texts=[query],
            n_results=n_results,
            where=where,
        )

        if not results["documents"] or not results["documents"][0]:
            return []

        return [
            {
                "content": doc,
                "metadata": meta,
                "distance": dist,
            }
            for doc, meta, dist in zip(
                results["documents"][0],
                results["metadatas"][0],
                results["distances"][0],
            )
        ]
    except Exception as e:
        logger.error(f"Vector search error: {e}")
        return _mock_search_results(query)


def _mock_search_results(query: str) -> List[Dict[str, Any]]:
    """Fallback mock results when ChromaDB is unavailable."""
    return [
        {
            "content": f"PR #847: Switched to polling-based event ingestion due to webhook delivery failures in Kubernetes environment. Reliability improved from 73% to 99.9%.",
            "metadata": {"source": "github", "title": "PR #847", "url": "#", "date": "2024-02-15"},
            "distance": 0.12,
        },
        {
            "content": f"BACKEND-1123: Investigate webhook delivery failures. Root cause: firewall rules blocking inbound connections from GitHub IP ranges.",
            "metadata": {"source": "jira", "title": "BACKEND-1123", "url": "#", "date": "2024-02-10"},
            "distance": 0.18,
        },
        {
            "content": f"#backend-infra Slack thread: 'After the third incident this week, switching to polling makes more sense for reliability.'",
            "metadata": {"source": "slack", "title": "#backend-infra discussion", "url": "#", "date": "2024-02-08"},
            "distance": 0.24,
        },
    ]


def delete_workspace_documents(workspace_id: str) -> bool:
    """Delete all documents for a workspace (for cleanup)."""
    if collection is None:
        return False
    try:
        collection.delete(where={"workspace_id": {"$eq": workspace_id}})
        return True
    except Exception as e:
        logger.error(f"Error deleting workspace documents: {e}")
        return False
