@echo off
echo ========================================
echo Fixing Web Access Issues
echo ========================================
echo.

echo Step 1: Checking if API is running...
curl -s http://localhost:8000/api/v1/health >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] API is not running!
    echo Please start the API first using: scripts\start-api.bat
    pause
    exit /b 1
)
echo [OK] API is running

echo.
echo Step 2: Stopping web dev server if running...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq *vite*" >nul 2>&1

echo.
echo Step 3: Cleaning web cache...
cd apps\web
if exist node_modules\.vite (
    echo Removing .vite cache...
    rmdir /s /q node_modules\.vite
)
if exist dist (
    echo Removing dist folder...
    rmdir /s /q dist
)

echo.
echo Step 4: Checking .env file...
if not exist .env (
    echo Creating .env file...
    echo VITE_API_URL=http://localhost:8000/api/v1 > .env
    echo [OK] .env file created
) else (
    echo [OK] .env file exists
)

echo.
echo Step 5: Starting web development server...
echo.
echo ========================================
echo Web server will start now
echo Access the app at: http://localhost:5173
echo ========================================
echo.

start "Sijadin Web" cmd /k "npm run dev"

echo.
echo [SUCCESS] Web server is starting in a new window
echo.
echo If you still have issues:
echo 1. Clear browser cache (Ctrl+Shift+Delete)
echo 2. Try incognito/private mode
echo 3. Check browser console for errors
echo.
pause
