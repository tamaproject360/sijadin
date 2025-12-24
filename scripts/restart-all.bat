@echo off
echo ========================================
echo Restarting All Services
echo ========================================
echo.

echo Step 1: Stopping all services...
echo Stopping API...
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *Sijadin API*" >nul 2>&1
echo Stopping Web...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq *Sijadin Web*" >nul 2>&1
echo Stopping Worker...
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *Sijadin Worker*" >nul 2>&1

timeout /t 2 /nobreak >nul

echo.
echo Step 2: Starting API server...
cd apps\api
start "Sijadin API" cmd /k "python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"
cd ..\..

timeout /t 3 /nobreak >nul

echo.
echo Step 3: Starting Worker...
cd apps\worker
start "Sijadin Worker" cmd /k "python -m celery -A worker worker --loglevel=info --pool=solo"
cd ..\..

timeout /t 2 /nobreak >nul

echo.
echo Step 4: Cleaning web cache...
cd apps\web
if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite
)

echo.
echo Step 5: Starting Web server...
start "Sijadin Web" cmd /k "npm run dev"
cd ..\..

echo.
echo ========================================
echo All services are starting!
echo ========================================
echo.
echo API:    http://localhost:8000
echo Web:    http://localhost:5173
echo Docs:   http://localhost:8000/docs
echo.
echo [SUCCESS] All services started in separate windows
echo.
pause
