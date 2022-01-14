#!/bin/sh

YELLOW='\033[0;33m'
GREEN='\033[0;32m'
NC='\033[0m'

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd "${DIR}"
cd ../frontend

source .env

echo "Running in ${YELLOW}/frontend${NC} directory"

export NODE_ENV=production
export REACT_APP_WS_URL=$WS_URL_PRODUCTION
export REACT_APP_WS_PORT=$WS_PORT_PRODUCTION
export REACT_APP_CLIENT_ID=$CLIENT_ID_PRODUCTION

echo
echo "Setting:"
echo "  ${YELLOW}NODE_ENV:${NC} ${GREEN}$NODE_ENV${NC}"
echo "  ${YELLOW}REACT_APP_WS_URL:${NC} ${GREEN}$REACT_APP_WS_URL${NC}"
echo "  ${YELLOW}REACT_APP_WS_PORT:${NC} ${GREEN}$REACT_APP_WS_PORT${NC}"
echo "  ${YELLOW}REACT_APP_CLIENT_ID:${NC} ${GREEN}$REACT_APP_CLIENT_ID${NC}"
echo

read -p "Continue to deploy? " -n 1 -r
echo # (optional) move to a new line

if [[ $REPLY =~ ^[Yy]$ ]]
then
  yarn run build

  echo "Deploying to Github..."
  yarn run deploy

  echo "✅ ${GREEN}Deployed successfully.${NC}"
fi
