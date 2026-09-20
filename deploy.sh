#!/bin/bash
set -e

echo "========================================="
echo "   VANNATE OS - Automated EC2 Deployer   "
echo "========================================="

echo "[1/4] Pulling latest commits from GitHub..."
git pull origin main

echo "[2/4] Installing dependencies..."
npm install --legacy-peer-deps

echo "[3/4] Building production standalone bundle..."
npm run build

echo "[4/4] Syncing standalone assets and reloading PM2..."
cp -r public .next/standalone/ 2>/dev/null || true
mkdir -p .next/standalone/.next && cp -r .next/static .next/standalone/.next/

pm2 reload vannate --update-env || pm2 start .next/standalone/server.js --name "vannate"
pm2 save

echo "========================================="
echo "  Deployment Complete! System Live!     "
echo "========================================="
