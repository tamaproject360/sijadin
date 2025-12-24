@echo off
echo ========================================
echo Restarting API Server
echo ========================================
echo.

echo Step 1: Stopping API server...
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *Sijadin API*" >nul 2>&1
timeout /t 2 /nobreak >nul

echo Step 2: Starting API server...
cd apps\api

echo.
echo ========================================
echo API server will start now
echo Access the API at: http://localhost:8000
echo API docs at: http://localhost:8000/docs
echo ========================================
echo.

start "Sijadin API" cmd /k "python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo.
echo [SUCCESS] API server is starting in a new window
echo.
pause
