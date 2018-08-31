#!/bin/sh

echo Deploying jukebox api

export NODE_PATH=$(npm root -g)
cd backend && shipit pi deploy
