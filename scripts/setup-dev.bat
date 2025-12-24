@echo off
echo ============================================================
echo Sijadin - Development Setup
echo ============================================================
echo.

echo [1/6] Starting infrastructure services...
docker-compose up -d postgres redis minio minio-init
echo Waiting for services to be ready (30 seconds)...
timeout /t 30 /nobreak > nul
echo.

echo [2/6] Setting up API backend...
cd apps\api
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate
echo Installing dependencies...
pip install -r requirements.txt
echo.

echo [3/6] Running database migrations...
alembic upgrade head
echo.

echo [4/6] Creating default user...
python ..\..\scripts\create_default_user.py
echo.

echo [5/6] Setting up worker...
cd ..\worker
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate
echo Installing dependencies...
pip install -r requirements.txt
cd ..\..
echo.

echo [6/6] Setting up frontend...
cd apps\web
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
cd ..\..
echo.

echo ============================================================
echo Setup Complete!
echo ============================================================
echo.
echo Default Login:
echo   Email: admin@sijadin.local
echo   Password: admin123
echo.
echo To start the application:
echo   1. API:      cd apps\api ^&^& venv\Scripts\activate ^&^& uvicorn main:app --reload
echo   2. Worker:   cd apps\worker ^&^& venv\Scripts\activate ^&^& python worker.py
echo   3. Frontend: cd apps\web ^&^& npm run dev
echo.
echo Or use: scripts\start-dev.bat
echo ============================================================
pause
