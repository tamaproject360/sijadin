"""
Embedding Service for RAG
"""
import httpx
from typing import List, Optional
from app.core.config import settings


class EmbeddingService:
    """Generate embeddings for text chunks"""
    
    def __init__(self):
        self.provider = "gemini"  # or "openai"
        
    async def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for a single text"""
        if self.provider == "gemini":
            return await self._gemini_embed(text)
        else:
            raise ValueError(f"Unknown embedding provider: {self.provider}")
    
    async def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts"""
        embeddings = []
        for text in texts:
            emb = await self.generate_embedding(text)
            embeddings.append(emb)
        return embeddings
    
    async def _gemini_embed(self, text: str) -> List[float]:
        """Generate embedding using Gemini API"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent",
                params={"key": settings.GEMINI_API_KEY},
                json={
                    "model": "models/text-embedding-004",
                    "content": {
                        "parts": [{"text": text}]
                    }
                },
                timeout=30.0
            )
            response.raise_for_status()
            data = response.json()
            return data["embedding"]["values"]
    
    def chunk_text(
        self, 
        text: str, 
        chunk_size: int = 1000, 
        overlap: int = 200
    ) -> List[str]:
        """Split text into overlapping chunks"""
        chunks = []
        start = 0
        text_len = len(text)
        
        while start < text_len:
            end = start + chunk_size
            chunk = text[start:end]
            
            # Try to break at sentence boundary
            if end < text_len:
                last_period = chunk.rfind('.')
                last_newline = chunk.rfind('\n')
                break_point = max(last_period, last_newline)
                
                if break_point > chunk_size * 0.5:  # At least 50% of chunk
                    chunk = chunk[:break_point + 1]
                    end = start + break_point + 1
            
            chunks.append(chunk.strip())
            start = end - overlap
        
        return chunks
