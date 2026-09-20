#!/bin/bash
# VANNATE AI - Autonomous Humanitarian OS [Tester 1-Click Launcher (macOS/Linux)]
# Architected & Built Solely by Soumoditya Das (AWS Bharat Builds Tour)

echo "==============================================================================="
echo "  VANNATE AI: AUTONOMOUS HUMANITARIAN OS & CIVIC EMERGENCY GRID"
echo "  Architected & Built Solely by Soumoditya Das (Fullstack Shinobi)"
echo "  AWS First Commit | Bharat Builds Tour | WeMakeDevs Hackathon"
echo "==============================================================================="
echo ""

# 1. Check Node.js
echo "[1/5] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is NOT installed! Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi
echo "   -- Found $(node -v) (OK)"

# 2. Check npm
echo "[2/5] Checking npm package manager..."
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm is NOT installed!"
    exit 1
fi
echo "   -- Found npm $(npm -v) (OK)"

# 3. Setup .env.local
echo "[3/5] Checking environment configuration (.env.local)..."
if [ ! -f .env.local ]; then
    if [ -f .env ]; then
        echo "   -- Initializing .env.local from active .env file..."
        cp .env .env.local
    elif [ -f .env.example ]; then
        echo "   -- Initializing .env.local from .env.example template..."
        cp .env.example .env.local
    fi
    echo "   -- .env.local configured!"
else
    echo "   -- .env.local already configured (OK)"
fi

# 4. Install dependencies if missing
echo "[4/5] Checking project dependencies (node_modules)..."
if [ ! -d node_modules ]; then
    echo "   -- Installing dependencies with npm install --legacy-peer-deps..."
    npm install --legacy-peer-deps
else
    echo "   -- Dependencies already installed (OK)"
fi

# 5. Launch
echo "[5/5] Launching Vannate AI Dev Server..."
echo ""
echo "==============================================================================="
echo "  SUCCESS! VANNATE AI IS STARTING NOW"
echo "  Local URL:    http://localhost:3000"
echo "  Intro Portal: http://localhost:3000/intro"
echo "  Crisis Map:   http://localhost:3000/crisis"
echo "  Webcam OCR:   http://localhost:3000/verify"
echo "  NGO OS:       http://localhost:3000/dashboard"
echo "  Blood Grid:   http://localhost:3000/blood"
echo "==============================================================================="
echo ""

# Auto-open browser on macOS or Linux
if [[ "$OSTYPE" == "darwin"* ]]; then
    (sleep 3 && open http://localhost:3000) &
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    (sleep 3 && xdg-open http://localhost:3000) &
fi

npm run dev -- -p 3000
