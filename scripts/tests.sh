#!/bin/sh

echo Running all tests

docker-compose run -e CI=true --rm jukebox-client npm test -- --coverage
docker-compose run -e CI=true --rm jukebox-api npm test -- --coverage
