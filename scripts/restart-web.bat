@echo off
echo Restarting web development server...
echo.

cd apps\web

echo Cleaning cache and build artifacts...
if exist node_modules\.vite rmdir /s /q node_modules\.vite
if exist dist rmdir /s /q dist

echo.
echo Starting development server...
npm run dev
