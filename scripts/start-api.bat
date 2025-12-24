@echo off
echo ========================================
echo Starting API Server
echo ========================================
echo.

cd apps\api

echo Activating virtual environment...
call venv\Scripts\activate

echo.
echo Starting API server...
echo API will be available at: http://localhost:8000
echo API docs at: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

uvicorn main:app --reload --host 0.0.0.0 --port 8000
