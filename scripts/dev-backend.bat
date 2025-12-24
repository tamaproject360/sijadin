@echo off
echo ========================================
echo Starting Backend Development Server
echo ========================================
echo.

REM Check if Docker services are running
echo [1/3] Checking Docker services...
docker ps | findstr sijadin_postgres >nul 2>&1
if errorlevel 1 (
    echo Docker services not running. Starting infrastructure...
    docker-compose up -d postgres redis minio
    echo Waiting for services to be ready...
    timeout /t 10 /nobreak >nul
) else (
    echo Docker services already running ✓
)
echo.

REM Check if virtual environment exists
echo [2/3] Checking Python environment...
if not exist "apps\api\venv" (
    echo Virtual environment not found. Please run setup-backend.bat first!
    pause
    exit /b 1
)
echo Python environment ready ✓
echo.

REM Start the API server
echo [3/3] Starting FastAPI server...
echo.
echo ========================================
echo Backend server starting at:
echo http://localhost:8000
echo API docs at: http://localhost:8000/docs
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

cd apps\api
call venv\Scripts\activate.bat
uvicorn main:app --reload --host 0.0.0.0 --port 8000
