# SAIRA ACAD - Quick Setup for Forms Integration
# This script installs the new dependencies and sets up the file upload system

Write-Host "🚀 SAIRA ACAD Forms Integration Setup" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (Test-Path "backend\package.json") {
    Write-Host "✅ Found backend directory" -ForegroundColor Green
} else {
    Write-Host "❌ Error: Run this script from the SAIRA folder" -ForegroundColor Red
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
    exit 1
}

# Navigate to backend
Write-Host ""
Write-Host "📂 Navigating to backend folder..." -ForegroundColor Yellow
Set-Location backend

# Install dependencies
Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
Write-Host "   - Installing multer for file uploads..." -ForegroundColor Gray
npm install multer

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Create uploads directory structure
Write-Host ""
Write-Host "📁 Creating upload directories..." -ForegroundColor Yellow

$uploadsDir = "uploads"
$resumesDir = "uploads\resumes"

if (-not (Test-Path $uploadsDir)) {
    New-Item -ItemType Directory -Path $uploadsDir | Out-Null
    Write-Host "   ✅ Created: $uploadsDir" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  Already exists: $uploadsDir" -ForegroundColor Gray
}

if (-not (Test-Path $resumesDir)) {
    New-Item -ItemType Directory -Path $resumesDir | Out-Null
    Write-Host "   ✅ Created: $resumesDir" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  Already exists: $resumesDir" -ForegroundColor Gray
}

# Return to root
Set-Location ..

Write-Host ""
Write-Host "✨ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Make sure MongoDB is running" -ForegroundColor White
Write-Host "   2. Start the backend server:" -ForegroundColor White
Write-Host "      cd backend" -ForegroundColor Gray
Write-Host "      npm start" -ForegroundColor Gray
Write-Host "   3. Open the frontend with Live Server" -ForegroundColor White
Write-Host "   4. Test all forms (see FORMS-TESTING-GUIDE.md)" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   - Forms API: backend\README.md" -ForegroundColor White
Write-Host "   - Testing Guide: FORMS-TESTING-GUIDE.md" -ForegroundColor White
Write-Host "   - Integration Summary: COMPLETE-INTEGRATION-SUMMARY.md" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Ready to test SAIRA ACAD!" -ForegroundColor Green
