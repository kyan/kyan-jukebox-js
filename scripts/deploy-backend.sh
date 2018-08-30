#!/bin/sh

echo Deploying jukebox backend

NODE_PATH=$(npm root -g)
cd backend && shipit pi deploy
