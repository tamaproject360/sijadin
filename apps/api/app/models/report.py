from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class ReportStatus(str, enum.Enum):
    DRAFTING = "drafting"
    PROCESSING = "processing"
    READY_TO_REVIEW = "ready_to_review"
    FINALIZED = "finalized"
    EXPORTED = "exported"


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    org_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    template_id = Column(Integer, ForeignKey("doc_templates.id"), nullable=True)
    title = Column(String(500), nullable=False)
    status = Column(Enum(ReportStatus), default=ReportStatus.DRAFTING, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Metadata fields
    activity_name = Column(String(500), nullable=True)
    location = Column(String(500), nullable=True)
    date_start = Column(String(50), nullable=True)
    date_end = Column(String(50), nullable=True)
    unit = Column(String(500), nullable=True)
    
    # Relationships
    organization = relationship("Organization", back_populates="reports")
    template = relationship("DocTemplate", back_populates="reports")
    creator = relationship("User", back_populates="reports")
    files = relationship("ReportFile", back_populates="report", cascade="all, delete-orphan")
    draft_versions = relationship("ReportDraftVersion", back_populates="report", cascade="all, delete-orphan")
    job_runs = relationship("JobRun", back_populates="report", cascade="all, delete-orphan")
    exports = relationship("Export", back_populates="report", cascade="all, delete-orphan")
