"""
Async MongoDB connection using Motor.
Provides db client and collection helpers.
"""
from motor.motor_asyncio import AsyncIOMotorClient
from config import settings
import logging

logger = logging.getLogger(__name__)

client: AsyncIOMotorClient = None


async def connect_db():
    """Connect to MongoDB on startup."""
    global client
    try:
        client = AsyncIOMotorClient(settings.mongo_uri, serverSelectionTimeoutMS=5000)
        await client.server_info()
        logger.info(f"✅ Connected to MongoDB: {settings.mongo_uri}")
    except Exception as e:
        logger.warning(f"⚠️  MongoDB not available: {e}. Running with mock data fallback.")
        client = None


async def disconnect_db():
    """Close MongoDB connection on shutdown."""
    global client
    if client:
        client.close()
        logger.info("MongoDB connection closed.")


def get_db():
    """Return the database instance."""
    if client is None:
        return None
    return client[settings.mongo_db]


def get_collection(name: str):
    """Return a named collection or None if DB unavailable."""
    db = get_db()
    if db is None:
        return None
    return db[name]
