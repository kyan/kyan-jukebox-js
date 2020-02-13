#!/bin/sh

echo Attempting to import lots of JB data

./import_track_adds.rb
./generate_user_votes.rb
./import_user_votes.rb
