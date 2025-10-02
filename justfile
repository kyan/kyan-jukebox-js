# List all available commands
default:
  @just --list

# Show help information
help:
  @echo "How to use:"
  @echo ""
  @echo "  $$ just build              build mongoDB and Mopidy images"
  @echo "  $$ just start              start mongoDB and Mopidy"
  @echo "  $$ just stop-all           stop all local development environment"
  @echo "  $$ just fe [TASK]          start the frontend or run frontend scripts (e.g just fe lint)"
  @echo "  $$ just be [TASK]          start the backend or run backend scripts (e.g just be lint)"
  @echo "  $$ just fe-test [ARGS]     runs ALL frontend tests (pass any args)"
  @echo "  $$ just be-test [ARGS]     runs ALL backend tests (pass any args)"
  @echo "  $$ just test               runs ALL tests (same as on CI)"
  @echo "  $$ just fe-deploy          production deploy of frontend to Github"
  @echo "  $$ just be-deploy          production deploy of backend using dist/ dir"

# Build mongoDB and Mopidy images
build:
  docker-compose down
  docker-compose build

# Start mongoDB and Mopidy (pass args like: just start -d)
start *ARGS:
  docker-compose {{ARGS}} up

# Stop all local development environment
stop-all:
  docker-compose down

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

# Production deploy of frontend to Github
fe-deploy:
  ./scripts/deploy-frontend.sh

# Production deploy of backend using dist/ dir
be-deploy:
  ./scripts/deploy-backend.sh
