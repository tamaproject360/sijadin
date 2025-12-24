@echo off
REM Start development environment for Sijadin (Windows)

echo Starting Sijadin Development Environment...

REM Check if .env exists
if not exist .env (
    echo .env file not found. Copying from .env.example...
    copy .env.example .env
    echo Please edit .env file with your configuration
    exit /b 1
)

REM Start infrastructure services
echo Starting infrastructure services (PostgreSQL, Redis, MinIO)...
docker-compose up -d postgres redis minio minio-init

REM Wait for services to be healthy
echo Waiting for services to be ready...
timeout /t 10 /nobreak

REM Check if services are running
docker-compose ps

echo.
echo Infrastructure services started!
echo.
echo Next steps:
echo 1. Setup backend: cd apps\api ^&^& python -m venv venv ^&^& venv\Scripts\activate ^&^& pip install -r requirements.txt
echo 2. Run migrations: cd apps\api ^&^& alembic upgrade head
echo 3. Start API: cd apps\api ^&^& uvicorn main:app --reload
echo 4. Setup frontend: cd apps\web ^&^& npm install ^&^& npm run dev
echo.
echo Access points:
echo - API: http://localhost:8000
echo - API Docs: http://localhost:8000/docs
echo - Frontend: http://localhost:5173
echo - MinIO Console: http://localhost:9001 (minioadmin/minioadmin123)
echo - PostgreSQL: localhost:5432 (sijadin/sijadin123)
echo - Redis: localhost:6379
