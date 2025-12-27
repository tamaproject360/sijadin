"""
Document Chunk Model for RAG/Embedding
"""
from sqlalchemy import Column, Integer, String, Text, ForeignKey, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector

from app.core.database import Base


class DocumentChunk(Base):
    """Store document chunks with embeddings for RAG"""
    __tablename__ = "document_chunks"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"), nullable=False)
    file_id = Column(Integer, ForeignKey("report_files.id"), nullable=True)
    
    # Chunk content
    content = Column(Text, nullable=False)
    chunk_index = Column(Integer, nullable=False)
    
    # Metadata
    source_type = Column(String(50), nullable=True)  # pdf, docx, image
    page_number = Column(Integer, nullable=True)
    
    # Embedding (1536 dimensions for OpenAI, adjust as needed)
    embedding = Column(Vector(1536), nullable=True)
    
    # Relationships
    report = relationship("Report")
    file = relationship("ReportFile")
    
    __table_args__ = (
        Index('ix_document_chunks_report_id', 'report_id'),
        Index('ix_document_chunks_embedding', 'embedding', postgresql_using='ivfflat'),
    )
