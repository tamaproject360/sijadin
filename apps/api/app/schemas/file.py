from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ReportFileResponse(BaseModel):
    id: int
    report_id: int
    kind: Optional[str]
    filename: str
    mime: str
    size: int
    storage_key: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class FileListResponse(BaseModel):
    files: List[ReportFileResponse]
    total: int
