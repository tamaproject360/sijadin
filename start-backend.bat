@echo off
chcp 65001 >nul
echo ========================================
echo SIJADIN - Backend Server
echo ========================================
echo.

REM Start Docker if not running
docker ps | findstr sijadin_postgres >nul 2>&1
if errorlevel 1 (
    echo [1/3] Starting Docker services...
    docker-compose up -d postgres redis minio
    timeout /t 10 /nobreak >nul
) else (
    echo [1/3] Docker services running OK
)

REM Check if venv exists, if not create it
if not exist "apps\api\venv" (
    echo [2/3] Setting up Python environment (first time)...
    cd apps\api
    py -m venv venv
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
    alembic upgrade head
    cd ..\..
) else (
    echo [2/3] Python environment ready OK
)

REM Start backend
echo [3/3] Starting backend server...
echo.
echo ========================================
echo Backend: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo ========================================
echo.
cd apps\api
call venv\Scripts\activate.bat
uvicorn main:app --reload --host 0.0.0.0 --port 8000
