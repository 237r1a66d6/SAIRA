@echo off
echo ========================================
echo   SAIRA ACAD - MongoDB Setup Helper
echo ========================================
echo.

echo Checking if Node.js is installed...
where node >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Node.js is installed!
    node --version
    npm --version
) else (
    echo [X] Node.js is NOT installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Download the LTS version and run the installer.
    echo.
    pause
    exit /b 1
)

echo.
echo Checking if MongoDB is installed...
where mongod >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] MongoDB is installed!
    mongod --version
) else (
    echo [X] MongoDB is NOT installed!
    echo.
    echo Please install MongoDB Community Server from:
    echo https://www.mongodb.com/try/download/community
    echo.
    echo After installation, MongoDB should start automatically as a Windows service.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   All prerequisites are installed!
echo ========================================
echo.
echo Next steps:
echo 1. Run: cd backend
echo 2. Run: npm install
echo 3. Run: npm start
echo.
pause
