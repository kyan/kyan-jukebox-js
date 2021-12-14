#!/bin/sh

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd "${DIR}"
cd ../frontend

source .env

echo "Running in '/frontend' directory"

export NODE_ENV=production
export REACT_APP_WS_URL=$WS_URL_PRODUCTION
export REACT_APP_WS_PORT=$WS_PORT_PRODUCTION
export REACT_APP_CLIENT_ID=$CLIENT_ID_PRODUCTION

echo "Setting:"
echo "  NODE_ENV: $NODE_ENV"
echo "  REACT_APP_WS_URL: $REACT_APP_WS_URL"
echo "  REACT_APP_WS_PORT: $REACT_APP_WS_PORT"
echo "  REACT_APP_CLIENT_ID: $REACT_APP_CLIENT_ID"

echo "Building..."
yarn run build

echo "Deploying to Github..."
yarn run deploy

echo "Done!"
