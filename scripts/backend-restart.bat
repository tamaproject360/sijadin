@echo off
echo ========================================
echo SIJADIN - Restart Backend
echo ========================================
echo.

echo Stopping backend...
call scripts\backend-stop.bat

echo.
echo Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo.
echo Starting backend...
call scripts\backend-start.bat
