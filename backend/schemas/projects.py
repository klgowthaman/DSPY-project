from pydantic import BaseModel
from typing import Optional

class CreateProjectRequest(BaseModel):
    name: str
    description: str = ""
    language: str = "Python"
    repo_url: str = ""
    github_token: Optional[str] = None
    jira_token: Optional[str] = None
    slack_token: Optional[str] = None
    llm_api_key: Optional[str] = None

class UpdateProjectIntegrationsRequest(BaseModel):
    github_token: Optional[str] = None
    jira_token: Optional[str] = None
    slack_token: Optional[str] = None
    llm_api_key: Optional[str] = None
