"""
Institutional Memory Agent — FastAPI Backend
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from config import settings
from database import connect_db, disconnect_db
from vector_store import init_vector_store
from routers import auth, projects, ai, analytics, team, workspaces

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    logger.info("🚀 Starting Institutional Memory Agent API...")
    await connect_db()
    init_vector_store()
    logger.info("✅ API ready.")
    yield
    logger.info("Shutting down...")
    await disconnect_db()


app = FastAPI(
    title="Institutional Memory Agent API",
    description="AI-powered engineering knowledge retrieval with DSPy multi-hop reasoning",
    version="1.0.0",
    lifespan=lifespan,
)

# -------------------------------------------------------
# CORS
# -------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------
# Routers
# -------------------------------------------------------
app.include_router(auth.router)
app.include_router(workspaces.router)
app.include_router(projects.router)

app.include_router(ai.router)
app.include_router(analytics.router)
app.include_router(team.router)


# -------------------------------------------------------
# Health check
# -------------------------------------------------------
@app.get("/health")
async def health():
    from database import get_db
    db_status = "connected" if get_db() is not None else "unavailable (mock mode)"
    return {
        "status": "ok",
        "version": "1.0.0",
        "database": db_status,
    }


@app.get("/")
async def root():
    return {
        "name": "Institutional Memory Agent API",
        "docs": "/docs",
        "health": "/health",
    }
