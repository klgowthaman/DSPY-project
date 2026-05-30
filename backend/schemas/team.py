from pydantic import BaseModel
from typing import Literal

class InviteRequest(BaseModel):
    email: str
    role: Literal["engineer", "viewer"] = "engineer"

class UpdateRoleRequest(BaseModel):
    role: Literal["admin", "engineer", "viewer"]
