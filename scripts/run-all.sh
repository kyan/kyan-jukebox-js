#!/usr/bin/env bash
#
# Orchestration script for running frontend and backend in parallel.
# This script delegates actual command execution to the justfile (single source of truth).
#
# By default runs in development mode with hot reload:
#  - Starts (or reuses) mopidy via docker compose
#  - Runs frontend dev server via justfile (port 3000)
#  - Runs backend dev server via justfile (port 8080)
#
# Production mode (--prod):
#  - Builds and runs both services in production mode via justfile
#
# Requirements:
#  - bash, docker, docker compose plugin (docker compose v2), just, bun
#
# Usage:
#   scripts/run-all.sh [OPTIONS]
#
# Options:
#   --prod              Run in production mode
#   --no-docker         Skip starting Docker services
#   --no-frontend       Don't start frontend
#   --no-backend        Don't start backend
#   --frontend-port N   Override frontend port (default: 3000 dev, 3001 prod)
#   --backend-port N    Override backend port (default: 8080)
#   -h, --help          Show this help
#
# Examples:
#   scripts/run-all.sh
#   scripts/run-all.sh --prod
#   scripts/run-all.sh --no-docker --frontend-port 4000
#   scripts/run-all.sh --no-backend    # frontend only
#   scripts/run-all.sh --no-frontend   # backend only
#
set -euo pipefail

ROOT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && cd .. && pwd )"
cd "$ROOT_DIR"

# Configuration
USE_PROD=false
USE_DOCKER=true
RUN_FRONTEND=true
RUN_BACKEND=true
FRONTEND_PORT=""
BACKEND_PORT=""

# Colors
c_green="\033[32m"
c_yellow="\033[33m"
c_red="\033[31m"
c_reset="\033[0m"

log() { printf "${c_green}[run-all]${c_reset} %s\n" "$*"; }
warn() { printf "${c_yellow}[run-all]${c_reset} %s\n" "$*"; }
err() { printf "${c_red}[run-all]${c_reset} %s\n" "$*" >&2; }

usage() {
  grep '^#' "$0" | sed -E 's/^# ?//'
  exit 1
}

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --prod) USE_PROD=true; shift ;;
    --no-docker) USE_DOCKER=false; shift ;;
    --no-frontend) RUN_FRONTEND=false; shift ;;
    --no-backend) RUN_BACKEND=false; shift ;;
    --frontend-port) FRONTEND_PORT="${2:-}"; shift 2 ;;
    --backend-port) BACKEND_PORT="${2:-}"; shift 2 ;;
    -h|--help) usage ;;
    *) err "Unknown arg: $1"; usage ;;
  esac
done

# Set default ports if not overridden
if [[ -z "$FRONTEND_PORT" ]]; then
  FRONTEND_PORT=$([ "$USE_PROD" = true ] && echo "3001" || echo "3000")
fi
if [[ -z "$BACKEND_PORT" ]]; then
  BACKEND_PORT="8080"
fi

# Verify required commands
need_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    err "Missing required command: $1"
    exit 2
  fi
}

need_cmd just
need_cmd bun

# Docker services (Mopidy)
if $USE_DOCKER; then
  need_cmd docker
  if ! docker info >/dev/null 2>&1; then
    err "Docker daemon not available."
    exit 3
  fi

  compose_cmd="docker compose"
  if ! $compose_cmd version >/dev/null 2>&1; then
    # Fallback to legacy docker-compose
    if command -v docker-compose >/dev/null 2>&1; then
      compose_cmd="docker-compose"
    else
      err "docker compose plugin or docker-compose not found."
      exit 3
    fi
  fi

  # M1 note
  if [[ "$(uname -m)" == "arm64" && -z "${DOCKER_DEFAULT_PLATFORM:-}" ]]; then
    warn "On Apple Silicon. If you run into image issues try: export DOCKER_DEFAULT_PLATFORM=linux/amd64"
  fi

  log "Starting dependency containers (mopidy)..."
  $compose_cmd up -d mopidy
else
  warn "--no-docker specified: assuming mopidy already running/available."
fi

# Track background processes
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

# Start services using justfile commands (single source of truth)
if $RUN_FRONTEND; then
  if $USE_PROD; then
    log "Building and starting frontend (production) on :$FRONTEND_PORT"
    # Build first
    just build-frontend
    # Start production server
    ( just start-fe "$FRONTEND_PORT" 2>&1 | sed 's/^/[frontend] /' ) &
    PIDS+=($!)
  else
    log "Starting frontend (development) on :$FRONTEND_PORT"
    ( PORT="$FRONTEND_PORT" just dev-fe 2>&1 | sed 's/^/[frontend] /' ) &
    PIDS+=($!)
  fi
else
  warn "Frontend disabled via --no-frontend"
fi

if $RUN_BACKEND; then
  if $USE_PROD; then
    log "Building and starting backend (production) on :$BACKEND_PORT"
    # Build first
    just build-backend
    # Start production server
    ( just start-be "$BACKEND_PORT" 2>&1 | sed 's/^/[backend] /' ) &
    PIDS+=($!)
  else
    log "Starting backend (development) on :$BACKEND_PORT"
    ( PORT="$BACKEND_PORT" just dev-be 2>&1 | sed 's/^/[backend] /' ) &
    PIDS+=($!)
  fi
else
  warn "Backend disabled via --no-backend"
fi

# Summary
log "----------------------------------------------------------------"
log "Services started:"
if $RUN_FRONTEND; then
  if $USE_PROD; then
    log "  Frontend:  http://localhost:${FRONTEND_PORT} (production)"
  else
    log "  Frontend:  http://localhost:${FRONTEND_PORT} (development with hot reload)"
  fi
fi
if $RUN_BACKEND; then
  if $USE_PROD; then
    log "  Backend:   http://localhost:${BACKEND_PORT} (production)"
  else
    log "  Backend:   http://localhost:${BACKEND_PORT} (development with hot reload)"
  fi
fi
log "  Mopidy:    http://localhost:6680 (if docker enabled)"
log ""
log "Logs are prefixed with [frontend] and [backend] to distinguish sources."
log "Press Ctrl+C to stop all services."
log "----------------------------------------------------------------"

# Wait for any background job to exit
wait -n || true
# Cleanup handled by trap
