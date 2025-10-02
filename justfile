# List all available commands
default:
  @just --list

# Show help information
help:
  @echo "How to use:"
  @echo ""
  @echo "  $$ just build              build mongoDB and Mopidy images"
  @echo "  $$ just start-services     start mongoDB and Mopidy"
  @echo "  $$ just stop-all           stop all local development environment"
  @echo "  $$ just mongodb-shell      open bash shell in MongoDB container"
  @echo "  $$ just mopidy-shell       open bash shell in Mopidy container"
  @echo "  $$ just fe [TASK]          start the frontend or run frontend scripts (e.g just fe lint)"
  @echo "  $$ just be [TASK]          start the backend or run backend scripts (e.g just be lint)"
  @echo "  $$ just fe-test [ARGS]     runs ALL frontend tests (pass any args)"
  @echo "  $$ just be-test [ARGS]     runs ALL backend tests (pass any args)"
  @echo "  $$ just test               runs ALL tests (same as on CI)"
  @echo "  $$ just validate           validate formatting, types, and linting for all workspaces"
  @echo "  $$ just fix                auto-fix formatting and linting for all workspaces"
  @echo "  $$ just fe-validate        validate frontend formatting, types, and linting"
  @echo "  $$ just fe-fix             auto-fix frontend formatting and linting"
  @echo "  $$ just be-validate        validate backend formatting, types, and linting"
  @echo "  $$ just be-fix             auto-fix backend formatting and linting"
  @echo "  $$ just fe-deploy          production deploy of frontend to Github"
  @echo "  $$ just be-deploy          production deploy of backend using dist/ dir"

# Build mongoDB and Mopidy images
build:
  docker-compose down
  docker-compose build

# Start mongoDB and Mopidy (pass args like: just start -d)
start-services *ARGS:
  docker-compose {{ARGS}} up

# Stop all local development environment
stop-all:
  docker-compose down

# Open bash shell in MongoDB container
mongodb-shell:
  docker exec -it mongodb /bin/bash

# Open bash shell in Mopidy container
mopidy-shell:
  docker exec -it mopidy /bin/bash

# Run frontend scripts (defaults to start, e.g. just fe lint)
fe TASK="start":
  yarn workspace @jukebox/frontend {{TASK}}

# Run backend scripts (defaults to start, e.g. just be lint)
be TASK="start":
  yarn workspace @jukebox/backend {{TASK}}

# Run ALL frontend tests (pass any args)
fe-test *ARGS:
  yarn workspace @jukebox/frontend test {{ARGS}}

# Run ALL backend tests (pass any args)
be-test *ARGS:
  yarn workspace @jukebox/backend test {{ARGS}}

# Run ALL tests (same as on CI)
test:
  CI=true yarn workspace @jukebox/frontend test:ci
  CI=true yarn workspace @jukebox/backend test:ci

# Validate formatting, types, and linting for all workspaces
validate:
  @echo "Validating frontend..."
  yarn workspace @jukebox/frontend validate
  @echo "✓ Frontend validation passed"
  @echo "Validating backend..."
  yarn workspace @jukebox/backend validate
  @echo "✓ Backend validation passed"

# Auto-fix formatting and linting for all workspaces
fix:
  @echo "Fixing frontend..."
  yarn workspace @jukebox/frontend fix
  @echo "✓ Frontend fixed"
  @echo "Fixing backend..."
  yarn workspace @jukebox/backend fix
  @echo "✓ Backend fixed"

# Validate frontend formatting, types, and linting
fe-validate:
  yarn workspace @jukebox/frontend validate

# Auto-fix frontend formatting and linting
fe-fix:
  yarn workspace @jukebox/frontend fix

# Validate backend formatting, types, and linting
be-validate:
  yarn workspace @jukebox/backend validate

# Auto-fix backend formatting and linting
be-fix:
  yarn workspace @jukebox/backend fix

# Production deploy of frontend to Github
fe-deploy:
  ./scripts/deploy-frontend.sh

# Production deploy of backend using dist/ dir
be-deploy:
  ./scripts/deploy-backend.sh
