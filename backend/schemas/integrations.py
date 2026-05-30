from pydantic import BaseModel
from typing import Optional

class ConnectRequest(BaseModel):
    token: str
    base_url: Optional[str] = None
    extra: Optional[dict] = {}
