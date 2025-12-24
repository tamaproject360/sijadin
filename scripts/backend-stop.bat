@echo off
echo ========================================
echo SIJADIN - Stop Backend
echo ========================================
echo.

echo Stopping API server...
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *Sijadin API*" >nul 2>&1

echo Stopping Worker...
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *Sijadin Worker*" >nul 2>&1

echo Stopping infrastructure services...
docker-compose stop postgres redis minio

echo.
echo ========================================
echo Backend Stopped!
echo ========================================
echo.
pause
