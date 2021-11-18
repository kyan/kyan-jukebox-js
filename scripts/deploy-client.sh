#!/bin/sh

source .env

echo Deploying jukebox client

docker-compose run \
  -e NODE_ENV=production \
  -e REACT_APP_WS_URL=jukebox-api-prod.local \
  -e REACT_APP_WS_PORT=8080 \
  -e REACT_APP_CLIENT_ID=$CLIENT_ID_PRODUCTION \
  jukebox-client yarn run build

cd frontend && yarn run deploy
