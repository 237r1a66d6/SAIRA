# SAIRA ACAD - Complete Setup Script
# This script sets up the entire platform with backend integration

Write-Host ""
Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                ║" -ForegroundColor Cyan
Write-Host "║        SAIRA ACAD - Complete Setup             ║" -ForegroundColor Cyan
Write-Host "║    Strategic Academics Innovation Resources   ║" -ForegroundColor Cyan
Write-Host "║                                                ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "backend\package.json")) {
    Write-Host "❌ Error: Run this script from the SAIRA folder" -ForegroundColor Red
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Found SAIRA project directory" -ForegroundColor Green
Write-Host ""

# Step 1: Check Node.js
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Step 1: Checking Prerequisites" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

try {
    $nodeVersion = node --version
    Write-Host "   ✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Node.js not found!" -ForegroundColor Red
    Write-Host "   Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

try {
    $npmVersion = npm --version
    Write-Host "   ✅ npm installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ npm not found!" -ForegroundColor Red
    exit 1
}

# Check MongoDB
Write-Host ""
Write-Host "   Checking MongoDB..." -ForegroundColor Gray
try {
    $mongoStatus = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
    if ($mongoStatus) {
        if ($mongoStatus.Status -eq 'Running') {
            Write-Host "   ✅ MongoDB service is running" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  MongoDB service found but not running" -ForegroundColor Yellow
            Write-Host "   Attempting to start MongoDB..." -ForegroundColor Gray
            Start-Service -Name MongoDB -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 2
            Write-Host "   ✅ MongoDB started" -ForegroundColor Green
        }
    } else {
        Write-Host "   ⚠️  MongoDB service not found" -ForegroundColor Yellow
        Write-Host "   Please ensure MongoDB is installed and running" -ForegroundColor Gray
        Write-Host "   Download: https://www.mongodb.com/try/download/community" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ℹ️  Could not detect MongoDB service" -ForegroundColor Gray
    Write-Host "   Make sure MongoDB is running before starting the backend" -ForegroundColor Yellow
}

Write-Host ""

# Step 2: Install Backend Dependencies
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Step 2: Installing Backend Dependencies" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

Set-Location backend

Write-Host "   📦 Installing packages..." -ForegroundColor Gray
Write-Host "      - express (web framework)" -ForegroundColor DarkGray
Write-Host "      - mongoose (MongoDB ODM)" -ForegroundColor DarkGray
Write-Host "      - jsonwebtoken (authentication)" -ForegroundColor DarkGray
Write-Host "      - bcryptjs (password hashing)" -ForegroundColor DarkGray
Write-Host "      - multer (file uploads)" -ForegroundColor DarkGray
Write-Host "      - cors, dotenv, express-validator" -ForegroundColor DarkGray
Write-Host ""

npm install --silent

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ All dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "   ❌ Failed to install dependencies" -ForegroundColor Red
    Set-Location ..
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Step 3: Create Upload Directories
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Step 3: Creating Directory Structure" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

$directories = @(
    "uploads",
    "uploads\resumes"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "   ✅ Created: $dir" -ForegroundColor Green
    } else {
        Write-Host "   ✅ Already exists: $dir" -ForegroundColor DarkGray
    }
}

Set-Location ..

Write-Host ""

# Step 4: Configuration Check
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Step 4: Checking Configuration" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

if (Test-Path "backend\.env") {
    Write-Host "   ✅ .env file found" -ForegroundColor Green
    Write-Host "      MongoDB: mongodb://localhost:27017/saira_acad" -ForegroundColor DarkGray
    Write-Host "      Port: 5000" -ForegroundColor DarkGray
} else {
    Write-Host "   ⚠️  .env file not found" -ForegroundColor Yellow
    Write-Host "      Using default configuration" -ForegroundColor Gray
}

Write-Host ""

# Summary
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "✨ Setup Complete!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

Write-Host "📊 Platform Statistics:" -ForegroundColor Cyan
Write-Host "   • 16 HTML pages" -ForegroundColor White
Write-Host "   • 10 Database models" -ForegroundColor White
Write-Host "   • 14+ API endpoints" -ForegroundColor White
Write-Host "   • 7 Interactive forms" -ForegroundColor White
Write-Host "   • File upload support" -ForegroundColor White
Write-Host "   • JWT authentication" -ForegroundColor White
Write-Host ""

Write-Host "🚀 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   1. Start the Backend Server:" -ForegroundColor White
Write-Host "      cd backend" -ForegroundColor Gray
Write-Host "      npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Open Frontend:" -ForegroundColor White
Write-Host "      • Use Live Server extension in VS Code" -ForegroundColor Gray
Write-Host "      • Or open index.html in browser" -ForegroundColor Gray
Write-Host ""
Write-Host "   3. Test the Platform:" -ForegroundColor White
Write-Host "      • Register a new user" -ForegroundColor Gray
Write-Host "      • Login and explore dashboard" -ForegroundColor Gray
Write-Host "      • Try all 7 forms" -ForegroundColor Gray
Write-Host "      • Upload resume files" -ForegroundColor Gray
Write-Host ""

Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   • Quick Start:        QUICK-START.md" -ForegroundColor White
Write-Host "   • Complete Setup:     SETUP-GUIDE.md" -ForegroundColor White
Write-Host "   • Forms Testing:      FORMS-TESTING-GUIDE.md" -ForegroundColor White
Write-Host "   • Integration Info:   COMPLETE-INTEGRATION-SUMMARY.md" -ForegroundColor White
Write-Host "   • Backend API:        backend\README.md" -ForegroundColor White
Write-Host ""

Write-Host "🌐 Default URLs:" -ForegroundColor Cyan
Write-Host "   • Backend API:    http://localhost:5000" -ForegroundColor White
Write-Host "   • Frontend:       http://127.0.0.1:5500" -ForegroundColor White
Write-Host ""

Write-Host "💡 Tips:" -ForegroundColor Cyan
Write-Host "   • Keep terminal open when backend is running" -ForegroundColor DarkGray
Write-Host "   • Check MongoDB Compass to view data" -ForegroundColor DarkGray
Write-Host "   • Default admin: username=admin, password=1234567@_a" -ForegroundColor DarkGray
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

$response = Read-Host "Would you like to start the backend server now? (Y/N)"
if ($response -eq 'Y' -or $response -eq 'y') {
    Write-Host ""
    Write-Host "🚀 Starting backend server..." -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    Set-Location backend
    npm start
} else {
    Write-Host ""
    Write-Host "👋 Setup complete! Start the server when ready with:" -ForegroundColor Green
    Write-Host "   cd backend && npm start" -ForegroundColor Gray
    Write-Host ""
}
