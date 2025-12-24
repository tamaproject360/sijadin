from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class ReportStatus(str, Enum):
    DRAFTING = "drafting"
    PROCESSING = "processing"
    READY_TO_REVIEW = "ready_to_review"
    FINALIZED = "finalized"
    EXPORTED = "exported"


class ReportCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    template_id: Optional[int] = None
    activity_name: Optional[str] = None
    location: Optional[str] = None
    date_start: Optional[str] = None
    date_end: Optional[str] = None
    unit: Optional[str] = None


class ReportUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    activity_name: Optional[str] = None
    location: Optional[str] = None
    date_start: Optional[str] = None
    date_end: Optional[str] = None
    unit: Optional[str] = None
    status: Optional[ReportStatus] = None


class ReportResponse(BaseModel):
    id: int
    org_id: Optional[int]
    template_id: Optional[int]
    title: str
    status: str
    created_by: int
    created_at: datetime
    updated_at: datetime
    activity_name: Optional[str] = None
    location: Optional[str] = None
    date_start: Optional[str] = None
    date_end: Optional[str] = None
    unit: Optional[str] = None
    
    class Config:
        from_attributes = True


class ReportListResponse(BaseModel):
    reports: List[ReportResponse]
    total: int
    page: int
    page_size: int
