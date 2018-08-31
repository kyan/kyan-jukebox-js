#!/bin/sh

echo Deploying jukebox api

NODE_PATH=$(npm root -g)
cd backend && shipit pi deploy
