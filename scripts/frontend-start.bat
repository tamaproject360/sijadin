@echo off
echo ========================================
echo SIJADIN - Start Frontend
echo ========================================
echo.

cd apps\web

echo Checking .env file...
if not exist .env (
    echo Creating .env file...
    echo VITE_API_URL=http://localhost:8000/api/v1 > .env
    echo [OK] .env file created
) else (
    echo [OK] .env file exists
)

echo.
echo Starting development server...
echo Frontend will be available at: http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev
