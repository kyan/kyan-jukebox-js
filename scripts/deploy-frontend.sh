#!/bin/sh

echo Deploying jukebox frontend

docker-compose run \
  -e NODE_ENV=production \
  -e REACT_APP_WS_URL=jukebox-api-prod.local \
  -e REACT_APP_WS_PORT=8080 \
  jukebox-client npm run build

cd frontend && npm run deploy
