"""
Chutes AI Provider Implementation
"""
import httpx
from typing import Optional, Dict, Any, List
from app.services.llm_provider import LLMProvider
from app.core.config import settings


class ChutesProvider(LLMProvider):
    """Chutes AI LLM Provider"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.CHUTES_API_KEY
        self.base_url = "https://api.chutes.ai/v1"
        
    async def generate_text(
        self, 
        prompt: str, 
        context: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None
    ) -> str:
        """Generate text using Chutes AI"""
        full_prompt = f"{context}\n\n{prompt}" if context else prompt
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-4",
                    "messages": [
                        {"role": "user", "content": full_prompt}
                    ],
                    "temperature": temperature,
                    "max_tokens": max_tokens or 2000
                },
                timeout=60.0
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
    
    async def analyze_document(
        self, 
        text: str, 
        instructions: str
    ) -> Dict[str, Any]:
        """Analyze document and extract structured data"""
        prompt = f"""{instructions}

Document text:
{text}

Return response as JSON."""
        
        result = await self.generate_text(prompt)
        
        # Parse JSON response
        import json
        try:
            return json.loads(result)
        except json.JSONDecodeError:
            # Fallback: return as text
            return {"raw_text": result}
    
    async def caption_images(
        self, 
        image_paths: List[str], 
        instructions: str
    ) -> List[Dict[str, Any]]:
        """Caption images (Chutes doesn't support vision, return placeholder)"""
        # Chutes AI doesn't have vision API, return basic info
        return [
            {
                "image_path": path,
                "caption": "Image caption not available (text-only model)",
                "note": "Use Gemini provider for image analysis"
            }
            for path in image_paths
        ]
    
    async def classify_file(
        self,
        filename: str,
        text_preview: str,
        mime_type: str
    ) -> str:
        """Classify file into category"""
        prompt = f"""Classify this document into ONE of these categories:
- KAK (Kerangka Acuan Kerja / TOR)
- agenda (Susunan acara / jadwal kegiatan)
- tiket (Tiket transportasi: pesawat, kereta, dll)
- undangan (Surat undangan)
- daftar_hadir (Daftar peserta / daftar hadir)
- foto (Foto dokumentasi)
- other (Lainnya)

Filename: {filename}
MIME type: {mime_type}
Text preview (first 500 chars):
{text_preview[:500]}

Return ONLY the category name, nothing else."""
        
        result = await self.generate_text(prompt, temperature=0.3)
        return result.strip().lower()
