#!/usr/bin/env bash
#
# Run backend API and frontend with hot reload plus dependent services (Mopidy).
#
# By default runs in development mode with hot reload:
#  - Starts (or reuses) mopidy via docker compose
#  - Runs the frontend development server with hot reload on port 3000
#  - Runs the backend with ts-node-dev (auto reload) on port 8080 (or $PORT)
#
# Production mode (--prod):
#  - Builds backend (tsc) and runs the compiled dist version (NODE_ENV=production)
#  - Builds the frontend once and serves the static build on port 3001
#
# Requirements:
#  - bash, docker, docker compose plugin (docker compose v2), yarn, node
#
# Usage:
#   scripts/run-all.sh [--prod] [--no-docker] [--no-frontend] [--frontend-port <port>] [--backend-port <port>] [--skip-install]
#
# Examples:
#   scripts/run-all.sh
#   scripts/run-all.sh --prod
#   scripts/run-all.sh --no-docker --frontend-port 4000 --backend-port 9000
#
set -euo pipefail

ROOT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && cd .. && pwd )"
cd "$ROOT_DIR"

FRONTEND_WS='@jukebox/frontend'
BACKEND_WS='@jukebox/backend'

USE_PROD=false
USE_DOCKER=true
RUN_FRONTEND=true
FRONTEND_PORT=3000
BACKEND_PORT="${PORT:-8080}"
SKIP_INSTALL=false

# Colors
c_green="\033[32m"
c_yellow="\033[33m"
c_red="\033[31m"
c_dim="\033[2m"
c_reset="\033[0m"

log() { printf "${c_green}[run-all]${c_reset} %s\n" "$*"; }
warn() { printf "${c_yellow}[run-all][warn]${c_reset} %s\n" "$*"; }
err() { printf "${c_red}[run-all][error]${c_reset} %s\n" "$*" >&2; }

usage() {
  grep '^#' "$0" | sed -E 's/^# ?//'
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --prod) USE_PROD=true; FRONTEND_PORT=3001; shift ;;
    --no-docker) USE_DOCKER=false; shift ;;
    --no-frontend) RUN_FRONTEND=false; shift ;;
    --frontend-port) FRONTEND_PORT="${2:-}"; shift 2 ;;
    --backend-port) BACKEND_PORT="${2:-}"; shift 2 ;;
    --skip-install) SKIP_INSTALL=true; shift ;;
    -h|--help) usage ;;
    *) err "Unknown arg: $1"; usage ;;
  esac
done

# Ensure yarn dependencies (monorepo root)
if ! $SKIP_INSTALL; then
  if [[ ! -d node_modules ]]; then
    log "Installing root dependencies (yarn workspaces)..."
    yarn install --silent
  else
    log "Skipping install (node_modules present). Use --skip-install to force skip or remove node_modules to reinstall."
  fi
fi

# Helper: check command
need_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    err "Missing required command: $1"
    exit 2
  fi
}

# Docker services
if $USE_DOCKER; then
  need_cmd docker
  if ! docker info >/dev/null 2>&1; then
    err "Docker daemon not available."
    exit 3
  fi

  compose_cmd="docker compose"
  if ! $compose_cmd version >/dev/null 2>&1; then
    # fallback to legacy docker-compose
    if command -v docker-compose >/dev/null 2>&1; then
      compose_cmd="docker-compose"
    else
      err "docker compose plugin or docker-compose not found."
      exit 3
    fi
  fi

  # M1 note (avoid silent build failures for Mopidy images)
  if [[ "$(uname -m)" == "arm64" && -z "${DOCKER_DEFAULT_PLATFORM:-}" ]]; then
    warn "On Apple Silicon. If you run into image issues try: export DOCKER_DEFAULT_PLATFORM=linux/amd64"
  fi

  log "Starting dependency containers (mopidy)..."
  $compose_cmd up -d mopidy
else
  warn "--no-docker specified: assuming mopidy already running/available."
fi

PIDS=()

cleanup() {
  local code=$?
  log "Shutting down (signal caught or script end)."
  for pid in "${PIDS[@]:-}"; do
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid" 2>/dev/null || true
      wait "$pid" 2>/dev/null || true
    fi
  done
  log "Done."
  exit "$code"
}

trap cleanup INT TERM EXIT

# Frontend
if $RUN_FRONTEND; then
  if $USE_PROD; then
    log "Building frontend workspace ($FRONTEND_WS) for static serving..."
    yarn workspace "$FRONTEND_WS" build

    BUILD_DIR="frontend/build"
    if [[ ! -d "$BUILD_DIR" ]]; then
      err "Frontend build dir not found at $BUILD_DIR"
      exit 4
    fi

    # Serve static build
    # Try: npx serve, then npx http-server, else node inline server.
    serve_static() {
      local dir="$1"
      local port="$2"

      if command -v npx >/dev/null 2>&1; then
        if npx --yes serve -v >/dev/null 2>&1; then
          log "Serving frontend with 'serve' on :$port"
          npx --yes serve "$dir" -l "$port"
          return
        elif npx --yes http-server -v >/dev/null 2>&1; then
          log "Serving frontend with 'http-server' on :$port"
          npx --yes http-server "$dir" -p "$port" -c-1
          return
        fi
      fi

      warn "Falling back to minimal Node static server."
      node <<'EOF' "$dir" "$port"
const http = require('http')
const path = require('path')
const fs = require('fs')
const root = process.argv[2]
const port = parseInt(process.argv[3] || '3001', 10)

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.map': 'application/json'
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404)
      return res.end('Not found')
    }
    const ext = path.extname(filePath)
    res.setHeader('Content-Type', mime[ext] || 'application/octet-stream')
    res.end(data)
  })
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0])
  let filePath = path.join(root, urlPath)
  if (!filePath.startsWith(root)) {
    res.writeHead(403); return res.end('Forbidden')
  }
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      // SPA fallback
      filePath = path.join(root, 'index.html')
    }
    sendFile(res, filePath)
  })
})

server.listen(port, () => {
  console.log(`[frontend-static] listening on http://localhost:${port}`)
})
EOF
    }

    ( serve_static "$BUILD_DIR" "$FRONTEND_PORT" ) &
    PIDS+=($!)
  else
    log "Starting frontend development server with hot reload on :$FRONTEND_PORT"
    ( PORT="$FRONTEND_PORT" yarn workspace "$FRONTEND_WS" start 2>&1 | sed 's/^/[frontend] /' ) &
    PIDS+=($!)
  fi
else
  warn "Frontend disabled via --no-frontend"
fi

# Backend
if $USE_PROD; then
  log "Building backend workspace ($BACKEND_WS) for production..."
  yarn workspace "$BACKEND_WS" build
  log "Starting backend (production dist) on :$BACKEND_PORT"
  ( PORT="$BACKEND_PORT" NODE_ENV=production yarn workspace "$BACKEND_WS" start:prod 2>&1 | sed 's/^/[backend] /' ) &
else
  log "Starting backend (ts-node-dev) on :$BACKEND_PORT"
  ( PORT="$BACKEND_PORT" NODE_ENV=development yarn workspace "$BACKEND_WS" start 2>&1 | sed 's/^/[backend] /' ) &
fi
PIDS+=($!)

log "----------------------------------------------------------------"
log "Services started:"
if $RUN_FRONTEND; then
  if $USE_PROD; then
    log "  Frontend:  http://localhost:${FRONTEND_PORT} (static build)"
  else
    log "  Frontend:  http://localhost:${FRONTEND_PORT} (development server with hot reload)"
  fi
fi
if $USE_PROD; then
  log "  Backend:   http://localhost:${BACKEND_PORT} (production)"
else
  log "  Backend:   http://localhost:${BACKEND_PORT} (development with hot reload)"
fi

log "  Mopidy:    http://localhost:6680 (if docker enabled)"
log ""
log "Logs are prefixed with [frontend] and [backend] to distinguish sources."
log "Press Ctrl+C to stop all."
log "----------------------------------------------------------------"

# Wait for background jobs
wait -n || true
# Cleanup handled by trap
