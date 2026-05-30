from pydantic import BaseModel
from typing import Optional

class QueryRequest(BaseModel):
    question: str
    project_id: Optional[str] = None
    workspace_id: Optional[str] = None
