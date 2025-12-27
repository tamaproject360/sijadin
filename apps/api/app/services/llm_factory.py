"""
LLM Provider Factory
"""
from app.services.llm_provider import LLMProvider, LLMProviderType
from app.services.chutes_provider import ChutesProvider
from app.services.gemini_provider import GeminiProvider
from app.core.config import settings


def get_llm_provider(provider_type: LLMProviderType = None) -> LLMProvider:
    """Get LLM provider instance"""
    if provider_type is None:
        # Default to Gemini if available, else Chutes
        if settings.GEMINI_API_KEY:
            provider_type = LLMProviderType.GEMINI
        else:
            provider_type = LLMProviderType.CHUTES
    
    if provider_type == LLMProviderType.CHUTES:
        return ChutesProvider()
    elif provider_type == LLMProviderType.GEMINI:
        return GeminiProvider()
    else:
        raise ValueError(f"Unknown provider type: {provider_type}")
