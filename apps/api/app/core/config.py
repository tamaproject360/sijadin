from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Sijadin"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    
    # Database - using local PostgreSQL
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@localhost:5432/sijadin_db"
    DATABASE_URL_SYNC: str = "postgresql://postgres:password@localhost:5432/sijadin_db"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    
    # MinIO
    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin123"
    MINIO_SECURE: bool = False
    MINIO_BUCKET_UPLOADS: str = "uploads"
    MINIO_BUCKET_EXPORTS: str = "exports"
    MINIO_BUCKET_ARTIFACTS: str = "artifacts"
    
    # JWT
    JWT_SECRET_KEY: str = "your-secret-key-change-this-in-production-12345678"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # API
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    # File Upload
    MAX_UPLOAD_SIZE_MB: int = 50
    ALLOWED_MIME_TYPES: str = "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/jpg"
    
    # LLM Provider
    LLM_PROVIDER: str = "chutes"
    CHUTES_API_KEY: str = ""
    CHUTES_API_URL: str = "https://api.chutes.ai/v1"
    GEMINI_API_KEY: str = ""
    
    # Template
    TEMPLATE_DIR: str = "./templates"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = "../../.env"  # Load from project root
        case_sensitive = True
        extra = "ignore"  # Ignore extra fields from .env


settings = Settings()
