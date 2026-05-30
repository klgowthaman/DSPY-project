from pydantic import BaseModel, EmailStr

class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    company: str = ""
    workspace_name: str = "My Workspace"

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict
