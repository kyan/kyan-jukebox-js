# Jukebox 2.0

[![Codeship Status for kyan/jukebox-js](https://app.codeship.com/projects/586a0390-c700-0135-502a-06e1aecc9cf3/status?branch=master)](https://app.codeship.com/projects/261300)

An WebSocket/[Mopidy](https://github.com/mopidy) event powered JukeBox client and API

## Background

This is a work-in-progress replacement for our [existing office JukeBox](https://github.com/kyan/jukebox) that was started back on *9th Jan 2009*. That was/is a [Rails](https://github.com/rails) application with many moving parts and orginally connected to [MPD](https://github.com/MusicPlayerDaemon/MPD) directly via a socket. It has been through many modernising iterations, and now uses `Mopidy` but still has the moving parts and uses a socket connection (which now needs buffering). Things have moved fast in nearly 10 years, so it's time to make a fresh start using some new better fitting technologies.

## Overview

The Jukebox re-imagined still uses `Mopidy` but has been split into parts, Client and API, Both of which are written in `JavaScript`. It also uses smaller events messages passed back and forth over a websocket. Currently both the client and API live in this one repo, but in the future it will likely split into it's component parts.

## Requirements

```
$ git clone https://github.com/kyan/jukebox-js
$ cd jukebox-js
```

## Development

You can run everything in `Docker`. From the root of the repo, you just need to run:

```
$ docker-compose up
```

This will give you a give you a working client and API plus the perisistence layer. The client is available http://localhost:3001 running in dev mode, meaning any changes will cause the server to restart. By default the API will be talking to the live Mopidy instance in the office.

Both the frontend and backend use ENVs for their confirguration. You can make changes to the defaults by updating the `docker-compose.yml` file.

### Mopidy

If you want to run your own copy of Mopidy, you can buy yourself a Raspberry Pi and follow [these instructions](docs/mopidy_install.md).

### Specs

There is currently 100% test coverage and linting plumbed in. You can run the `frontend` specs with:

```
$ docker-compose run --rm jukebox-client npm test
```

You can run the `backend` specs with:

```
$ docker-compose run --rm jukebox-api npm test
```

You can add `--coverage` or/and `--watchAll` to the end for other options. e.g
```
$ docker-compose run --rm jukebox-api npm test -- --watchAll --coverage
```

### Client

You can find more information on the client via it's README in the `frontend` folder.

### API

You can find more information on the api via it's README in the `backend` folder.

### MongoDB

The API used `Mongodb` for it's perisistence layer. In development it will fire up a docker container running `Mongodb` and will point the API at it.

#### Seed data

You add seed Mongodb with some dummy data by running:
```
$ docker-compose run mongodb-seed /bin/seed.sh
```
*NOTE* This is reset Mongodb, deleting any data currently in there.

## Deployment

Deployment requires a couple of npm's to be installed on your local machine.
```
$ npm install -g gh-pages
$ npm install -g shipit-cli
$ npm install -g shipit-deploy
```

### client

To push out a new release of the [client](frontend/) you first need to build it. You can do this with:
```
$ docker-compose run -e NODE_ENV=production -e REACT_APP_WS_URL=jukebox-prod.local -e REACT_APP_WS_PORT=8080 jukebox-client npm run build
```
This will create a `build` directory in your local `frontend` folder. The frontend lives on github, so to push your new build you change into the `frontend` directory and run:
```
$ npm run deploy
```
You may have to wait a min for things to propergate, but you should now have pushed a new release. You can check at https://github.com/kyan/jukebox-js/tree/gh-pages.

### api

To push out a new release of the [api](backend/) you first need to build it. You can do this with:
```
$ docker-compose run jukebox-api npm run build
```
This will create a `dist` directory in your local `backend` folder. To push your new build you change into the `backend` directory and run:
```
$ export NODE_PATH=$(npm root -g)
$ shipit pi deploy
```

### mongodb

In production the api uses a EC2 server running mongodb and lives at `mongo.kyanmedia.net`.
