import os
from redis import Redis

# Redis connection
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
redis_conn = Redis.from_url(REDIS_URL)

# Database URL
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://sijadin:sijadin@localhost:5432/sijadin")
