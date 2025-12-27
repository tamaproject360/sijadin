"""
RAG (Retrieval Augmented Generation) Service
"""
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.document_chunk import DocumentChunk
from app.services.embedding_service import EmbeddingService


class RAGService:
    """Retrieve relevant document chunks for context"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.embedding_service = EmbeddingService()
    
    async def retrieve(
        self, 
        query: str, 
        report_id: int,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """Retrieve top-k most relevant chunks for a query"""
        # Generate query embedding
        query_embedding = await self.embedding_service.generate_embedding(query)
        
        # Vector similarity search using pgvector
        stmt = select(
            DocumentChunk,
            DocumentChunk.embedding.cosine_distance(query_embedding).label("distance")
        ).where(
            DocumentChunk.report_id == report_id,
            DocumentChunk.embedding.isnot(None)
        ).order_by(
            "distance"
        ).limit(top_k)
        
        result = await self.db.execute(stmt)
        rows = result.all()
        
        # Format results
        chunks = []
        for chunk, distance in rows:
            chunks.append({
                "content": chunk.content,
                "file_id": chunk.file_id,
                "page_number": chunk.page_number,
                "source_type": chunk.source_type,
                "similarity": 1 - distance  # Convert distance to similarity
            })
        
        return chunks
    
    async def build_context(
        self,
        query: str,
        report_id: int,
        max_tokens: int = 2000
    ) -> str:
        """Build context string from retrieved chunks"""
        chunks = await self.retrieve(query, report_id, top_k=10)
        
        context_parts = []
        total_length = 0
        
        for chunk in chunks:
            content = chunk["content"]
            if total_length + len(content) > max_tokens * 4:  # Rough token estimate
                break
            
            source_info = f"[File ID: {chunk['file_id']}"
            if chunk['page_number']:
                source_info += f", Page: {chunk['page_number']}"
            source_info += "]"
            
            context_parts.append(f"{source_info}\n{content}\n")
            total_length += len(content)
        
        return "\n---\n".join(context_parts)
