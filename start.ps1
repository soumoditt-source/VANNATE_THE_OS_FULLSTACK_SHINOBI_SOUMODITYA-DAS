# VANNATE AI - Autonomous Humanitarian OS [Tester 1-Click Launcher (PowerShell)]
# Architected & Built Solely by Soumoditya Das (AWS Bharat Builds Tour)

Write-Host "===============================================================================" -ForegroundColor Cyan
Write-Host "  VANNATE AI: AUTONOMOUS HUMANITARIAN OS & CIVIC EMERGENCY GRID" -ForegroundColor Yellow
Write-Host "  Architected & Built Solely by Soumoditya Das (Fullstack Shinobi)" -ForegroundColor Green
Write-Host "  AWS First Commit | Bharat Builds Tour | WeMakeDevs Hackathon" -ForegroundColor Cyan
Write-Host "===============================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check Node.js
Write-Host "[1/5] Checking Node.js installation..." -ForegroundColor Gray
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is NOT installed! Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    Exit 1
}
$nodeVer = node -v
Write-Host "   -- Found Node.js $nodeVer (OK)" -ForegroundColor Green

# 2. Check npm
Write-Host "[2/5] Checking npm package manager..." -ForegroundColor Gray
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] npm is NOT installed!" -ForegroundColor Red
    Exit 1
}
$npmVer = npm -v
Write-Host "   -- Found npm $npmVer (OK)" -ForegroundColor Green

# 3. Ensure .env.local
Write-Host "[3/5] Checking environment configuration (.env.local)..." -ForegroundColor Gray
if (-not (Test-Path ".env.local")) {
    if (Test-Path ".env") {
        Write-Host "   -- Initializing .env.local from active .env file..." -ForegroundColor DarkYellow
        Copy-Item ".env" ".env.local"
    } elseif (Test-Path ".env.example") {
        Write-Host "   -- Initializing .env.local from .env.example template..." -ForegroundColor DarkYellow
        Copy-Item ".env.example" ".env.local"
    }
    Write-Host "   -- .env.local configured!" -ForegroundColor Green
} else {
    Write-Host "   -- .env.local already present (OK)" -ForegroundColor Green
}

# 4. Install dependencies if missing
Write-Host "[4/5] Checking project dependencies (node_modules)..." -ForegroundColor Gray
if (-not (Test-Path "node_modules")) {
    Write-Host "   -- Installing dependencies with npm install --legacy-peer-deps..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
} else {
    Write-Host "   -- Dependencies already installed (OK)" -ForegroundColor Green
}

# 5. Launch
Write-Host "[5/5] Launching Vannate AI Dev Server..." -ForegroundColor Gray
Write-Host ""
Write-Host "===============================================================================" -ForegroundColor Green
Write-Host "  SUCCESS! VANNATE AI IS STARTING NOW" -ForegroundColor Green
Write-Host "  Local URL:    http://localhost:3000" -ForegroundColor Yellow
Write-Host "  Intro Portal: http://localhost:3000/intro" -ForegroundColor Cyan
Write-Host "  Crisis Map:   http://localhost:3000/crisis" -ForegroundColor Cyan
Write-Host "  Webcam OCR:   http://localhost:3000/verify" -ForegroundColor Cyan
Write-Host "  NGO OS:       http://localhost:3000/dashboard" -ForegroundColor Cyan
Write-Host "  Blood Grid:   http://localhost:3000/blood" -ForegroundColor Cyan
Write-Host "===============================================================================" -ForegroundColor Green
Write-Host ""

# Open browser asynchronously
Start-Process "http://localhost:3000"

npm run dev -- -p 3000
