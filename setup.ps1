# SAIRA ACAD - Backend Installation & Testing Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SAIRA ACAD - Setup & Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Node.js
Write-Host "[1/5] Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "  ✅ Node.js $nodeVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "  ❌ Node.js NOT installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Download from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "  Install LTS version and restart PowerShell" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit
}

Write-Host ""

# Step 2: Check MongoDB
Write-Host "[2/5] Checking MongoDB..." -ForegroundColor Yellow
$mongoRunning = $false
try {
    $mongoStatus = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
    if ($mongoStatus -and $mongoStatus.Status -eq "Running") {
        Write-Host "  ✅ MongoDB service is running" -ForegroundColor Green
        $mongoRunning = $true
    }
} catch {
    # Service not found
}

if (-not $mongoRunning) {
    Write-Host "  ⚠️  MongoDB service not found or not running" -ForegroundColor Yellow
    Write-Host "  Options:" -ForegroundColor White
    Write-Host "  1. Install MongoDB Community Server: https://www.mongodb.com/try/download/community" -ForegroundColor White
    Write-Host "  2. Or use MongoDB Atlas (cloud): Update .env with Atlas connection string" -ForegroundColor White
    Write-Host ""
    $continue = Read-Host "  Continue anyway? (Y/N)"
    if ($continue -ne "Y" -and $continue -ne "y") {
        exit
    }
}

Write-Host ""

# Step 3: Navigate to backend
Write-Host "[3/5] Setting up backend..." -ForegroundColor Yellow
$backendPath = Join-Path $PSScriptRoot "backend"
if (-not (Test-Path $backendPath)) {
    Write-Host "  ❌ Backend directory not found!" -ForegroundColor Red
    pause
    exit
}
Set-Location $backendPath
Write-Host "  ✅ Backend directory found" -ForegroundColor Green

Write-Host ""

# Step 4: Install dependencies
Write-Host "[4/5] Installing dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "  ✅ Already installed" -ForegroundColor Green
} else {
    Write-Host "  Installing packages (this may take 2-3 minutes)..." -ForegroundColor White
    npm install --silent
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Installation failed" -ForegroundColor Red
        pause
        exit
    }
}

Write-Host ""

# Step 5: Start server in background for testing
Write-Host "[5/5] Testing server..." -ForegroundColor Yellow
Write-Host "  Starting server..." -ForegroundColor White

$serverJob = Start-Job -ScriptBlock {
    Set-Location $using:backendPath
    npm start
}

# Wait a few seconds for server to start
Start-Sleep -Seconds 5

# Test the API
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✅ Server is running!" -ForegroundColor Green
        Write-Host "  ✅ API is responding" -ForegroundColor Green
    }
} catch {
    Write-Host "  ⚠️  Server started but not responding yet" -ForegroundColor Yellow
    Write-Host "  This is normal if MongoDB is still connecting" -ForegroundColor White
}

# Stop the test server
Stop-Job $serverJob
Remove-Job $serverJob

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete! ✨" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Run: .\start-backend.ps1 (to start the server)" -ForegroundColor White
Write-Host "2. Open index.html in Live Server" -ForegroundColor White
Write-Host "3. Try registering a new user" -ForegroundColor White
Write-Host "4. Or login as admin (username: admin, password: 1234567@_a)" -ForegroundColor White
Write-Host ""
Write-Host "API URL: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
pause
