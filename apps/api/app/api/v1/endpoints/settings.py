from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional
import os

from app.core.database import get_db
from app.core.security import get_current_active_user
from app.models.user import User

router = APIRouter()


class ApiKeyConfig(BaseModel):
    chutes_api_key: Optional[str] = None
    gemini_api_key: Optional[str] = None
    llm_provider: Optional[str] = "chutes"


class ApiKeyResponse(BaseModel):
    chutes_api_key: Optional[str] = None
    gemini_api_key: Optional[str] = None
    llm_provider: str = "chutes"
    has_chutes_key: bool = False
    has_gemini_key: bool = False


# In-memory storage for API keys (in production, use encrypted database storage)
_api_keys_store: dict = {
    "chutes_api_key": os.getenv("CHUTES_API_KEY", ""),
    "gemini_api_key": os.getenv("GEMINI_API_KEY", ""),
    "llm_provider": os.getenv("LLM_PROVIDER", "chutes"),
}


def mask_api_key(key: str) -> str:
    """Mask API key for display, showing only first 4 and last 4 characters."""
    if not key or len(key) < 12:
        return "****" if key else ""
    return f"{key[:4]}{'*' * (len(key) - 8)}{key[-4:]}"


@router.get("/settings/api-keys", response_model=ApiKeyResponse)
async def get_api_keys(
    current_user: User = Depends(get_current_active_user)
):
    """Get current API key configuration (masked)."""
    return ApiKeyResponse(
        chutes_api_key=mask_api_key(_api_keys_store.get("chutes_api_key", "")),
        gemini_api_key=mask_api_key(_api_keys_store.get("gemini_api_key", "")),
        llm_provider=_api_keys_store.get("llm_provider", "chutes"),
        has_chutes_key=bool(_api_keys_store.get("chutes_api_key")),
        has_gemini_key=bool(_api_keys_store.get("gemini_api_key")),
    )


@router.post("/settings/api-keys", response_model=ApiKeyResponse)
async def save_api_keys(
    config: ApiKeyConfig,
    current_user: User = Depends(get_current_active_user)
):
    """Save API key configuration."""
    # Update only provided values
    if config.chutes_api_key is not None:
        _api_keys_store["chutes_api_key"] = config.chutes_api_key
    
    if config.gemini_api_key is not None:
        _api_keys_store["gemini_api_key"] = config.gemini_api_key
    
    if config.llm_provider is not None:
        _api_keys_store["llm_provider"] = config.llm_provider
    
    return ApiKeyResponse(
        chutes_api_key=mask_api_key(_api_keys_store.get("chutes_api_key", "")),
        gemini_api_key=mask_api_key(_api_keys_store.get("gemini_api_key", "")),
        llm_provider=_api_keys_store.get("llm_provider", "chutes"),
        has_chutes_key=bool(_api_keys_store.get("chutes_api_key")),
        has_gemini_key=bool(_api_keys_store.get("gemini_api_key")),
    )


def get_active_api_key() -> tuple[str, str]:
    """Get the active API key based on selected provider.
    
    Returns:
        Tuple of (provider_name, api_key)
    """
    provider = _api_keys_store.get("llm_provider", "chutes")
    
    if provider == "gemini":
        return ("gemini", _api_keys_store.get("gemini_api_key", ""))
    else:
        return ("chutes", _api_keys_store.get("chutes_api_key", ""))
