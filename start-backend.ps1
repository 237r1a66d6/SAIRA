# SAIRA ACAD - Quick Start Script for Windows
# This script helps you set up and run the backend server

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SAIRA ACAD - Backend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Step 1: Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Choose the LTS version and restart PowerShell after installation." -ForegroundColor Yellow
    Write-Host ""
    pause
    exit
}

Write-Host ""

# Navigate to backend directory
$backendPath = Join-Path $PSScriptRoot "backend"
if (Test-Path $backendPath) {
    Set-Location $backendPath
    Write-Host "✅ Found backend directory" -ForegroundColor Green
} else {
    Write-Host "❌ Backend directory not found!" -ForegroundColor Red
    Write-Host "Make sure this script is in the SAIRA folder." -ForegroundColor Yellow
    pause
    exit
}

Write-Host ""

# Check if node_modules exists
if (Test-Path "node_modules") {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
} else {
    Write-Host "Step 2: Installing dependencies..." -ForegroundColor Yellow
    Write-Host "This may take a few minutes..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        pause
        exit
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Backend Server..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Server will run on: http://localhost:5000" -ForegroundColor Yellow
Write-Host "Keep this window open!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Default Admin Credentials:" -ForegroundColor Cyan
Write-Host "  Username: admin" -ForegroundColor White
Write-Host "  Password: 1234567@_a" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the server
npm start
