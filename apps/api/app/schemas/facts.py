"""
Facts Schema - Normalized data from all documents
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import date


class ParticipantFact(BaseModel):
    """Participant information"""
    name: str
    role: Optional[str] = None
    organization: Optional[str] = None


class AgendaItem(BaseModel):
    """Single agenda item"""
    time: Optional[str] = None
    activity: str
    speaker: Optional[str] = None
    location: Optional[str] = None


class AttachmentFact(BaseModel):
    """Attachment metadata"""
    file_id: int
    kind: str  # foto, tiket, undangan, etc
    filename: str
    caption: Optional[str] = None
    page_reference: Optional[int] = None


class Facts(BaseModel):
    """Complete facts extracted from all documents"""
    
    # Basic metadata
    activity_name: Optional[str] = None
    activity_purpose: Optional[str] = None
    location: Optional[str] = None
    date_start: Optional[date] = None
    date_end: Optional[date] = None
    
    # Organization info
    unit: Optional[str] = None
    organizer: Optional[str] = None
    
    # Participants
    participants: List[ParticipantFact] = Field(default_factory=list)
    
    # Agenda
    agenda: List[AgendaItem] = Field(default_factory=list)
    
    # Summary
    activity_summary: Optional[str] = None
    key_outcomes: List[str] = Field(default_factory=list)
    
    # Attachments
    attachments: List[AttachmentFact] = Field(default_factory=list)
    
    # Raw extracted data (for reference)
    raw_extractions: Dict[str, Any] = Field(default_factory=dict)
    
    class Config:
        json_schema_extra = {
            "example": {
                "activity_name": "Workshop Pengembangan Sistem Informasi",
                "location": "Jakarta",
                "date_start": "2024-01-15",
                "date_end": "2024-01-17",
                "unit": "Dinas Komunikasi dan Informatika",
                "participants": [
                    {"name": "John Doe", "role": "Peserta", "organization": "Diskominfo"}
                ],
                "agenda": [
                    {"time": "09:00", "activity": "Pembukaan", "speaker": "Kepala Dinas"}
                ]
            }
        }
