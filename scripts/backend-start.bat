@echo off
echo ========================================
echo SIJADIN - Start Backend
echo ========================================
echo.

echo Step 1: Starting infrastructure (PostgreSQL, Redis, MinIO)...
docker-compose up -d postgres redis minio

echo.
echo Step 2: Waiting for services to be ready...
timeout /t 5 /nobreak >nul

echo.
echo Step 3: Starting API server...
cd apps\api
start "Sijadin API" cmd /k "call venv\Scripts\activate && uvicorn main:app --reload --host 0.0.0.0 --port 8000"
cd ..\..

echo.
echo Step 4: Starting Worker...
cd apps\worker
start "Sijadin Worker" cmd /k "call venv\Scripts\activate && python -m celery -A worker worker --loglevel=info --pool=solo"
cd ..\..

echo.
echo ========================================
echo Backend Started!
echo ========================================
echo.
echo API:    http://localhost:8000
echo Docs:   http://localhost:8000/docs
echo.
echo Two new windows opened:
echo - Sijadin API (FastAPI server)
echo - Sijadin Worker (Celery worker)
echo.
echo To stop: Close the windows or run scripts\backend-stop.bat
echo.
pause
