#!/bin/sh

YELLOW='\033[0;33m'
GREEN='\033[0;32m'
NC='\033[0m'

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd "${DIR}"
cd ../backend

source .env

echo "Running in ${YELLOW}/backend${NC} directory"
echo "Deploying Github branch 'master' /dist directory to Pi..."

read -p "Continue to deploy? " -n 1 -r
echo # (optional) move to a new line

if [[ $REPLY =~ ^[Yy]$ ]]
then
  shipit pi deploy

  echo "✅ ${GREEN}Deployed successfully.${NC}"
fi
