"""
LLM Provider Abstraction
Supports multiple LLM providers (Chutes AI, Gemini)
"""
from abc import ABC, abstractmethod
from typing import Optional, Dict, Any, List
from enum import Enum


class LLMProviderType(str, Enum):
    CHUTES = "chutes"
    GEMINI = "gemini"


class LLMProvider(ABC):
    """Abstract base class for LLM providers"""
    
    @abstractmethod
    async def generate_text(
        self, 
        prompt: str, 
        context: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None
    ) -> str:
        """Generate text from prompt and optional context"""
        pass
    
    @abstractmethod
    async def analyze_document(
        self, 
        text: str, 
        instructions: str
    ) -> Dict[str, Any]:
        """Analyze document and return structured data"""
        pass
    
    @abstractmethod
    async def caption_images(
        self, 
        image_paths: List[str], 
        instructions: str
    ) -> List[Dict[str, Any]]:
        """Generate captions for images"""
        pass
    
    @abstractmethod
    async def classify_file(
        self,
        filename: str,
        text_preview: str,
        mime_type: str
    ) -> str:
        """Classify file into category (KAK, agenda, tiket, etc)"""
        pass
