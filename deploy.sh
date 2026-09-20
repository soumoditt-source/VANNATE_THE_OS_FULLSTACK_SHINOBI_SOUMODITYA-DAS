#!/bin/bash
# ============================================================
#  VANNATE OS — Production EC2 Deploy Script
#  Runs on: ubuntu@13.48.70.215
#  Usage:   bash deploy.sh [--skip-build]
# ============================================================
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_NAME="vannate"
LOG_FILE="$APP_DIR/deploy.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S UTC')

log() { echo "[$TIMESTAMP] $*" | tee -a "$LOG_FILE"; }

log "============================================="
log "   VANNATE OS — Automated EC2 Deployer"
log "   $(git log --oneline -1 2>/dev/null || echo 'no git')"
log "============================================="

# ── 1. Git Pull ──────────────────────────────────────────────
log "[1/5] Pulling latest commits from GitHub..."
git pull origin main 2>&1 | tee -a "$LOG_FILE"
COMMIT=$(git rev-parse --short HEAD)
log "→ Now at commit: $COMMIT"

# ── 2. Dependencies ──────────────────────────────────────────
log "[2/5] Installing dependencies (legacy-peer-deps)..."
npm install --legacy-peer-deps --prefer-offline 2>&1 | tee -a "$LOG_FILE"

# ── 3. Build ─────────────────────────────────────────────────
if [[ "${1:-}" != "--skip-build" ]]; then
  log "[3/5] Building production standalone bundle..."
  NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production npm run build 2>&1 | tee -a "$LOG_FILE"
else
  log "[3/5] Skipping build (--skip-build flag set)"
fi

# ── 4. Sync Static Assets ─────────────────────────────────────
log "[4/5] Syncing standalone assets..."
cp -r public .next/standalone/ 2>/dev/null || true
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/
log "→ Static assets synced."

# ── 5. Reload PM2 (zero-downtime) ────────────────────────────
log "[5/5] Reloading PM2 process (zero-downtime)..."
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
  pm2 reload "$APP_NAME" --update-env
  log "→ PM2 process '$APP_NAME' reloaded."
else
  pm2 start .next/standalone/server.js \
    --name "$APP_NAME" \
    --max-memory-restart 800M \
    --env production \
    -- -p 3000
  log "→ PM2 process '$APP_NAME' started fresh."
fi
pm2 save --force

# ── Health check ─────────────────────────────────────────────
log "Running local health check..."
sleep 5
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ || echo "000")
if [[ "$HTTP_STATUS" == "200" ]]; then
  log "✅ Health check PASSED (HTTP $HTTP_STATUS)"
else
  log "⚠️  Health check returned HTTP $HTTP_STATUS — check logs: pm2 logs $APP_NAME"
fi

log "============================================="
log "  ✅ Deployment Complete! Commit: $COMMIT"
log "  🌐 Live at: http://13.48.70.215"
log "============================================="
