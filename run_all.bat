@echo off
setlocal enabledelayedexpansion
title VANNATE AI - Autonomous Humanitarian OS [Tester 1-Click Launcher]
color 0B

echo ===============================================================================
echo   __      __     _   _ _   _          _______ ______              _____ 
echo   \ \    / /\   | \ | | \ | |   /\   |__   __|  ____|      /\    |_   _/
echo    \ \  / /  \  |  \| |  \| |  /  \     | |  | |__        /  \     | |  
echo     \ \/ / /\ \ | . ` | . ` | / /\ \    | |  |  __|      / /\ \    | |  
echo      \  / ____ \| |\  | |\  |/ ____ \   | |  | |____    / ____ \  _| |_ 
echo       \/_/    \_\_| \_|_| \_/_/    \_\  |_|  |______|  /_/    \_\|_____|
echo.
echo   AUTONOMOUS HUMANITARIAN OS ^& CIVIC EMERGENCY GRID
echo   Architected ^& Built Solely by Soumoditya Das (Fullstack Shinobi)
echo   AWS First Commit ^| Bharat Builds Tour ^| WeMakeDevs Hackathon
echo ===============================================================================
echo.

:: 1. Verify Node.js Environment
echo [1/5] Checking Node.js installation...
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ===============================================================================
    echo [ERROR] Node.js is NOT found in your system PATH!
    echo Please download and install Node.js 18 or 20 from: https://nodejs.org
    echo After installing, restart this script.
    echo ===============================================================================
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
echo    -- Found Node.js %NODE_VER% (OK)

:: 2. Verify npm Environment
echo [2/5] Checking npm package manager...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] npm is not found in your system PATH!
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('npm -v') do set NPM_VER=%%v
echo    -- Found npm %NPM_VER% (OK)

:: 3. Setup Environment Variables (.env.local)
echo [3/5] Checking environment configuration (.env.local)...
if not exist .env.local (
    if exist .env (
        echo    -- Generating .env.local from active .env file...
        copy /y .env .env.local >nul
    ) else if exist .env.example (
        echo    -- Generating .env.local from .env.example template...
        copy /y .env.example .env.local >nul
    )
    echo    -- .env.local successfully initialized!
) else (
    echo    -- .env.local already configured (OK).
)

:: 4. Verify and Install Dependencies
echo [4/5] Checking project dependencies (node_modules)...
if not exist node_modules (
    echo    -- node_modules missing. Installing dependencies with --legacy-peer-deps...
    echo    -- This may take 1-2 minutes on first run. Please wait...
    call npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        color 0C
        echo [ERROR] npm install encountered an error. Please inspect the log above.
        pause
        exit /b 1
    )
    echo    -- Dependencies successfully installed!
) else (
    echo    -- Dependencies already installed (OK).
)

:: 5. Launch Application & Auto-Open Browser
echo [5/5] Launching Vannate AI Dev Server on Port 3000...
echo.
echo ===============================================================================
echo   SUCCESS! VANNATE AI IS STARTING NOW
echo.
echo   Local URL:    http://localhost:3000
echo   Intro Portal: http://localhost:3000/intro
echo   Crisis Map:   http://localhost:3000/crisis
echo   Webcam OCR:   http://localhost:3000/verify
echo   NGO OS:       http://localhost:3000/dashboard
echo   Blood Grid:   http://localhost:3000/blood
echo.
echo   Opening browser in 4 seconds... Press Ctrl+C to terminate server.
echo ===============================================================================
echo.

:: Launch browser in background after short delay
start "" cmd /c "timeout /t 4 /nobreak >nul & start http://localhost:3000"

:: Start Next.js Development Server
call npm run dev -- -p 3000
if %errorlevel% neq 0 (
    echo.
    echo [INFO] Port 3000 may be busy, trying default Next.js port...
    call npm run dev
)

pause
