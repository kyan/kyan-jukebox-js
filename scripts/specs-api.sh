#!/bin/sh

echo Running API specs

docker-compose run --rm jukebox-api npm test -- $*
