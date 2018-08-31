#!/bin/sh

echo Running client specs

docker-compose run --rm jukebox-client npm test -- $*
