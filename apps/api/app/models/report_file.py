from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, BigInteger
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base


class ReportFile(Base):
    __tablename__ = "report_files"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"), nullable=False)
    kind = Column(String(100), nullable=True)  # KAK, agenda, tiket, undangan, daftar_hadir, foto
    filename = Column(String(500), nullable=False)
    mime = Column(String(100), nullable=False)
    size = Column(BigInteger, nullable=False)
    storage_key = Column(String(500), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    report = relationship("Report", back_populates="files")
