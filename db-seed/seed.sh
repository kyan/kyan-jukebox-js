#!/bin/bash

echo 'Starting to seed data: '
mongoimport --host mongodb --db jb-dev --collection users --type json --file /users.json --jsonArray --drop
printf 'Done!'
