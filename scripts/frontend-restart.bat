@echo off
echo ========================================
echo SIJADIN - Restart Frontend
echo ========================================
echo.

echo Stopping frontend...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq *Sijadin Web*" >nul 2>&1
taskkill /F /IM node.exe /FI "WINDOWTITLE eq *vite*" >nul 2>&1

echo.
echo Cleaning cache...
cd apps\web
if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite
    echo [OK] Cache cleaned
)

echo.
echo Starting frontend...
start "Sijadin Web" cmd /k "npm run dev"

cd ..\..

echo.
echo ========================================
echo Frontend Restarted!
echo ========================================
echo.
echo Access at: http://localhost:5173
echo.
pause
