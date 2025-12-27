@echo off
REM Run backend tests with coverage

echo ========================================
echo Running Backend Tests with Coverage
echo ========================================

cd apps\api

REM Install test dependencies if needed
pip install -r requirements-test.txt

REM Run pytest with coverage
pytest -v --cov=app --cov-report=html --cov-report=term

echo.
echo Coverage report generated in htmlcov/index.html

cd ..\..

echo.
echo ========================================
echo Tests completed
echo ========================================
pause
