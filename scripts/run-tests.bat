@echo off
REM Run backend tests

echo ========================================
echo Running Backend Tests
echo ========================================

cd apps\api

REM Install test dependencies if needed
pip install -r requirements-test.txt

REM Run pytest
pytest -v --tb=short

cd ..\..

echo.
echo ========================================
echo Tests completed
echo ========================================
pause
