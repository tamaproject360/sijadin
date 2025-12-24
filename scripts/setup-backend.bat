@echo off
echo ========================================
echo Backend Setup Script
echo ========================================
echo.

REM Check Python installation
echo [1/5] Checking Python installation...
py --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found! Please install Python 3.11 or higher.
    pause
    exit /b 1
)
py --version
echo.

REM Check Docker installation
echo [2/5] Checking Docker installation...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker not found! Please install Docker Desktop.
    pause
    exit /b 1
)
docker --version
echo.

REM Start Docker services
echo [3/5] Starting Docker services (PostgreSQL, Redis, MinIO)...
docker-compose up -d postgres redis minio
echo Waiting for services to initialize...
timeout /t 15 /nobreak >nul
echo.

REM Create virtual environment
echo [4/5] Creating Python virtual environment...
cd apps\api
if exist "venv" (
    echo Virtual environment already exists, skipping...
) else (
    py -m venv venv
    echo Virtual environment created ✓
)
echo.

REM Install dependencies
echo [5/5] Installing Python dependencies...
call venv\Scripts\activate.bat
pip install --upgrade pip
pip install -r requirements.txt
echo.

echo ========================================
echo Setup Complete! ✓
echo ========================================
echo.
echo Next steps:
echo 1. Run database migrations: npm run migrate
echo 2. Start backend server: npm run backend
echo    or: scripts\dev-backend.bat
echo.
pause
