"""
Google Gemini Provider Implementation (Multimodal)
"""
import httpx
import base64
from typing import Optional, Dict, Any, List
from pathlib import Path
from app.services.llm_provider import LLMProvider
from app.core.config import settings


class GeminiProvider(LLMProvider):
    """Google Gemini LLM Provider (supports vision)"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.base_url = "https://generativelanguage.googleapis.com/v1beta"
        self.model = "gemini-1.5-flash"
        
    async def generate_text(
        self, 
        prompt: str, 
        context: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None
    ) -> str:
        """Generate text using Gemini"""
        full_prompt = f"{context}\n\n{prompt}" if context else prompt
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/models/{self.model}:generateContent",
                params={"key": self.api_key},
                json={
                    "contents": [{
                        "parts": [{"text": full_prompt}]
                    }],
                    "generationConfig": {
                        "temperature": temperature,
                        "maxOutputTokens": max_tokens or 2048
                    }
                },
                timeout=60.0
            )
            response.raise_for_status()
            data = response.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]
    
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
            return {"raw_text": result}
    
    async def caption_images(
        self, 
        image_paths: List[str], 
        instructions: str
    ) -> List[Dict[str, Any]]:
        """Generate captions for images using Gemini Vision"""
        results = []
        
        async with httpx.AsyncClient() as client:
            for image_path in image_paths:
                # Read and encode image
                with open(image_path, "rb") as f:
                    image_data = base64.b64encode(f.read()).decode()
                
                # Determine mime type
                suffix = Path(image_path).suffix.lower()
                mime_map = {
                    ".jpg": "image/jpeg",
                    ".jpeg": "image/jpeg",
                    ".png": "image/png",
                    ".webp": "image/webp"
                }
                mime_type = mime_map.get(suffix, "image/jpeg")
                
                # Call Gemini Vision API
                response = await client.post(
                    f"{self.base_url}/models/{self.model}:generateContent",
                    params={"key": self.api_key},
                    json={
                        "contents": [{
                            "parts": [
                                {"text": instructions},
                                {
                                    "inline_data": {
                                        "mime_type": mime_type,
                                        "data": image_data
                                    }
                                }
                            ]
                        }]
                    },
                    timeout=60.0
                )
                response.raise_for_status()
                data = response.json()
                caption = data["candidates"][0]["content"]["parts"][0]["text"]
                
                results.append({
                    "image_path": image_path,
                    "caption": caption,
                    "metadata": {"mime_type": mime_type}
                })
        
        return results
    
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
