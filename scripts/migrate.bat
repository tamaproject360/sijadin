@echo off
echo ========================================
echo Running Database Migrations
echo ========================================
echo.

cd apps\api
call venv\Scripts\activate.bat
alembic upgrade head

echo.
echo Migrations complete ✓
pause
