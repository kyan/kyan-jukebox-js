# justfile - Kyan Jukebox Development Tasks
set shell := ["bash", "-cu"]

# Workspace names
FRONTEND_WS := "@jukebox/frontend"
BACKEND_WS  := "@jukebox/backend"

# Docker configuration
IMAGE_BASE := "jukebox"
DEFAULT_TAG := "latest"

# List all available tasks
default:
  @just --list

# ===================================================================
# SETUP & INFO
# ===================================================================

# Install dependencies and start development environment
[group('setup')]
setup:
  bun install --frozen-lockfile
  just deps-start

# Show current versions of tools and workspaces
[group('setup')]
version-info:
  @echo "Bun: `bun --version`"
  @echo "Frontend: `jq -r .version frontend/package.json`"
  @echo "Backend:  `jq -r .version backend/package.json`"

# ===================================================================
# DEVELOPMENT
# ===================================================================

# Start full development environment with hot reload for both frontend and backend
[group('dev')]
dev:
  ./scripts/run-all.sh

# Start production mode for both frontend and backend
[group('dev')]
prod:
  ./scripts/run-all.sh --prod

# Start only frontend in development mode with hot reload
[group('dev')]
dev-fe:
  bun --filter {{FRONTEND_WS}} dev

# Start only backend in development mode with hot reload
[group('dev')]
dev-be:
  bun --filter {{BACKEND_WS}} start

# Start frontend production server (must build first)
[group('dev')]
start-fe PORT="3000":
  cd frontend && PORT={{PORT}} NODE_ENV=production bun server.tsx

# Start backend production server (must build first)
[group('dev')]
start-be PORT="8080":
  cd backend && PORT={{PORT}} NODE_ENV=production bun start:prod

# Run any frontend workspace command (e.g., just fe build, just fe test)
[group('dev')]
fe TASK="dev":
  bun --filter {{FRONTEND_WS}} {{TASK}}

# Run any backend workspace command (e.g., just be test, just be lint)
[group('dev')]
be TASK="start":
  bun --filter {{BACKEND_WS}} {{TASK}}

# ===================================================================
# BUILDING & TESTING
# ===================================================================

# Build both frontend and backend for production
[group('build')]
build-all:
  bun --filter {{BACKEND_WS}} build
  bun --filter {{FRONTEND_WS}} build

# Build only frontend
[group('build')]
build-frontend:
  bun --filter {{FRONTEND_WS}} build

# Build only backend
[group('build')]
build-backend:
  bun --filter {{BACKEND_WS}} build

# Run all tests in CI mode
[group('test')]
test:
  CI=true bun --filter {{FRONTEND_WS}} test:ci
  CI=true bun --filter {{BACKEND_WS}} test:ci

# Run only frontend tests with verbose output
[group('test')]
test-frontend:
  bun --filter {{FRONTEND_WS}} test

# Run only backend tests with verbose output
[group('test')]
test-backend:
  bun --filter {{BACKEND_WS}} test

# Run backend tests in watch mode
[group('test')]
test-watch:
  bun --filter {{BACKEND_WS}} test --watchAll

# Lint and type-check all code
[group('test')]
check:
  @echo "Checking frontend..."
  bun --filter {{FRONTEND_WS}} validate
  @echo "Checking backend..."
  bun --filter {{BACKEND_WS}} validate

# Auto-fix linting and formatting issues
[group('test')]
fix:
  @echo "Fixing frontend..."
  bun --filter {{FRONTEND_WS}} fix
  @echo "Fixing backend..."
  bun --filter {{BACKEND_WS}} fix

# ===================================================================
# DOCKER
# ===================================================================

# Build all Docker images (backend, frontend)
[group('docker')]
docker-build-all TAG=DEFAULT_TAG: (docker-build-backend TAG) (docker-build-frontend TAG)

# Build backend Docker image
[group('docker')]
docker-build-backend TAG=DEFAULT_TAG SPOTIFY_ID="" SPOTIFY_SECRET="" SQLITE_PATH="/var/lib/jukebox/jukebox.db" WS_MOPIDY_URL="host.docker.internal" WS_MOPIDY_PORT="6680":
  docker build -f Dockerfile.backend \
    --build-arg SPOTIFY_ID={{SPOTIFY_ID}} \
    --build-arg SPOTIFY_SECRET={{SPOTIFY_SECRET}} \
    --build-arg SQLITE_PATH={{SQLITE_PATH}} \
    --build-arg WS_MOPIDY_URL={{WS_MOPIDY_URL}} \
    --build-arg WS_MOPIDY_PORT={{WS_MOPIDY_PORT}} \
    --build-arg SPOTIFY_NEW_TRACKS_ADDED_LIMIT=3 \
    --build-arg SQLITE_TIMEOUT=30000 \
    --build-arg IS_ALIVE_TIMEOUT=30000 \
    --build-arg EXPLICIT_CONTENT=true \
    --build-arg IMAGE_CACHE_EXPIRES=86400 \
    -t {{IMAGE_BASE}}-backend:{{TAG}} .

# Build frontend Docker image
[group('docker')]
docker-build-frontend TAG=DEFAULT_TAG WS_URL="localhost" WS_PORT="8080":
  docker build -f Dockerfile.frontend \
    --build-arg REACT_APP_WS_URL={{WS_URL}} \
    --build-arg REACT_APP_WS_PORT={{WS_PORT}} \
    -t {{IMAGE_BASE}}-frontend:{{TAG}} .

# Shell into running frontend Docker container
[group('docker')]
docker-shell-frontend TAG=DEFAULT_TAG:
  docker run -it --rm {{IMAGE_BASE}}-frontend:{{TAG}} /bin/sh

# Shell into running backend Docker container
[group('docker')]
docker-shell-backend TAG=DEFAULT_TAG:
  docker run -it --rm {{IMAGE_BASE}}-backend:{{TAG}} /bin/sh

# Run frontend container locally
[group('docker')]
docker-run-frontend TAG=DEFAULT_TAG PORT="3001":
  docker run -d --name jukebox-frontend-local -p {{PORT}}:3000 {{IMAGE_BASE}}-frontend:{{TAG}}

# Run backend container locally
[group('docker')]
docker-run-backend TAG=DEFAULT_TAG PORT="8080":
  docker run -d --name jukebox-backend-local -p {{PORT}}:8080 {{IMAGE_BASE}}-backend:{{TAG}}

# Run both frontend and backend containers locally
[group('docker')]
docker-run-all TAG=DEFAULT_TAG FE_PORT="3001" BE_PORT="8080": (docker-run-backend TAG BE_PORT) (docker-run-frontend TAG FE_PORT)

# Stop local frontend container
[group('docker')]
docker-stop-frontend:
  docker stop jukebox-frontend-local || true
  docker rm jukebox-frontend-local || true

# Stop local backend container
[group('docker')]
docker-stop-backend:
  docker stop jukebox-backend-local || true
  docker rm jukebox-backend-local || true

# Stop frontend and backend containers
[group('docker')]
docker-stop-all: docker-stop-frontend docker-stop-backend

# ===================================================================
# DEPENDENCIES
# ===================================================================

# Start dependency services (Mopidy)
[group('deps')]
deps-start:
  docker compose up -d mopidy

# Stop dependency services
[group('deps')]
deps-stop:
  docker compose stop mopidy

# Stop and remove dependency services
[group('deps')]
deps-down:
  docker compose down

# Connect to Mopidy container shell
[group('deps')]
mopidy-shell:
  docker exec -it mopidy /bin/bash

# Show SQLite database info
[group('deps')]
sqlite-info:
  @echo "SQLite database location: ./databases/jukebox.db"
  @echo "Production location: /var/lib/jukebox/jukebox.db"
  @if [ -f "./databases/jukebox.db" ]; then echo "Development database exists"; else echo "Development database not found"; fi

# ===================================================================
# DEPLOYMENT
# ===================================================================

# Initial server setup and Docker installation (run once)
[group('deploy')]
kamal-setup:
  @echo "Setting up servers and installing Docker..."
  kamal setup

# Deploy application to production
[group('deploy')]
kamal-deploy:
  @just kamal-validate
  @echo "Building and deploying application..."
  kamal deploy

# Check deployment status
[group('deploy')]
kamal-status:
  @echo "Checking application status..."
  kamal ps

# Stream application logs
[group('deploy')]
kamal-logs LINES="100":
  kamal app logs --lines {{LINES}} --follow

# Rollback to previous version
[group('deploy')]
kamal-rollback:
  @echo "Rolling back to previous version..."
  kamal rollback

# Access remote shell on deployed application
[group('deploy')]
kamal-shell:
  kamal app exec --interactive bash

# Complete deployment pipeline (test + build + deploy)
[group('deploy')]
deploy: check test docker-build-all kamal-deploy
