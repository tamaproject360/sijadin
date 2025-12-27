"""
Draft Schema - Canonical structure for report draft
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class Citation(BaseModel):
    """Citation/source reference"""
    file_id: int
    page: Optional[int] = None
    quote: Optional[str] = None


class TableRow(BaseModel):
    """Generic table row"""
    data: Dict[str, Any]


class Subsection(BaseModel):
    """Subsection within a section"""
    key: str
    title: Optional[str] = None
    content: Optional[str] = None
    table: Optional[List[TableRow]] = None


class Attachment(BaseModel):
    """Attachment in lampiran section"""
    file_id: int
    caption: Optional[str] = None
    note: Optional[str] = None


class Section(BaseModel):
    """Main section of the report"""
    key: str
    title: str
    content: Optional[str] = None
    citations: List[Citation] = Field(default_factory=list)
    subsections: List[Subsection] = Field(default_factory=list)
    attachments: Optional[Dict[str, List[Attachment]]] = None


class DraftMeta(BaseModel):
    """Report metadata"""
    activity_name: str
    location: str
    date_start: str
    date_end: str
    unit: str
    participants: List[str] = Field(default_factory=list)


class Draft(BaseModel):
    """Complete draft structure"""
    template_id: str
    title: str
    meta: DraftMeta
    sections: List[Section] = Field(default_factory=list)
    
    class Config:
        json_schema_extra = {
            "example": {
                "template_id": "tpl-instansi-a-v1",
                "title": "Laporan Perjalanan Dinas Workshop",
                "meta": {
                    "activity_name": "Workshop Pengembangan Sistem",
                    "location": "Jakarta",
                    "date_start": "2024-01-15",
                    "date_end": "2024-01-17",
                    "unit": "Diskominfo",
                    "participants": ["John Doe", "Jane Smith"]
                },
                "sections": [
                    {
                        "key": "pendahuluan",
                        "title": "Pendahuluan",
                        "content": "Laporan ini disusun...",
                        "citations": []
                    }
                ]
            }
        }
