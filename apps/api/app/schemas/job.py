from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum


class JobStatus(str, Enum):
    QUEUED = "queued"
    RUNNING = "running"
    SUCCESS = "success"
    FAILED = "failed"


class JobResponse(BaseModel):
    id: int
    report_id: int
    status: str
    progress: Optional[int]
    started_at: Optional[datetime]
    finished_at: Optional[datetime]
    error_json: Optional[Dict[str, Any]]
    
    class Config:
        from_attributes = True


class JobTriggerResponse(BaseModel):
    job_id: int
    status: str
    message: str
