#!/bin/sh

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd "${DIR}"
cd ../backend

source .env

echo "Running in '/backend' directory"

echo "Deploying Github 'master' /dist directory to Pi..."
shipit pi deploy

echo "Done!"
