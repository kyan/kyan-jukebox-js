![](https://github.com/kyan/jukebox-js/workflows/jukebox/badge.svg)

# Jukebox 2.0

A WebSocket/[Mopidy](https://github.com/mopidy) event powered JukeBox client and API

* [Background](#background)
* [Overview](#overview)
* [Requirements](#requirements)
* [Development](#development)
  * [Environment](#environment)
  * [Running the app](#running-the-app)
  * [Mopidy](#mopidy)
  * [Specs](#specs)
  * [Client](#client)
  * [API](#api)
  * [MongoDB](#mongodb)
  * [Adding a new package to `package.json`](#adding-a-new-package-to-packagejson)
  * [Adding a new environment variable](#adding-a-new-environment-variable)
* [Deployment](#deployment)
  * [client](#client-1)
  * [api](#api-1)
  * [mongodb](#mongodb-1)


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

### Environment

First, create a `.env` file in the root directory. Example vars can be found in the [`.env.example`](.env.example) file. At a minimum `WS_MOPIDY_URL`, `WS_MOPIDY_PORT` and `CLIENT_ID` values need to be defined.

`WS_MOPIDY_URL` must point to an instance of Mopidy, for example [running locally on a Raspberry Pi](docs/mopidy_install.md), [or within Docker](docs/mopidy_docker.md).

`CLIENT_ID` must be set to a valid Google app ID in order for any interaction with the app to be possible.

The backend also uses the Spotify API directly for some tasks. If you need this you will need to copy the `SPOTIFY_ID` and `SPOTIFY_SECRET` vars from the `.env.example` file to `.env` and [update the creds to your own](https://developer.spotify.com/dashboard/applications).

In production, we are posting currently-playing track information to an endpoint defined by `NOW_PLAYING_URL`. You can optionally set this in development (e.g. to test against [kyan.rocks](https://github.com/kyan/kyan-rocks), but you can also leave it blank.

### Running the app

From there, you can run everything in `Docker`. From the root of the repo, you just need to run:

```
$ make build
$ make serve
```

Or to run with local Mopidy:

```
$ make build-all
$ make serve-all
```

This will give you a working client and API plus the persistence layer. The client is available at http://localhost:3001 running in dev mode, meaning any changes will cause the server to restart.


### Mopidy

If you want to run your own copy of Mopidy, you can buy yourself a Raspberry Pi and follow [these instructions](docs/mopidy_install.md).

Alternatively, it is possible to run Mopidy from [within Docker](docs/mopidy_docker.md), although this currently does not support audio playback.

### Specs

There is currently 100% test coverage and linting plumbed in. You can run the `frontend` specs with:

```
$ ./scripts/specs-client.sh
```
this will also start a watcher looking for code changes and re-running the specs.

You can run the `backend` specs with:

```
$ ./scripts/specs-api.sh
```

You can add `--coverage` or/and `--watchAll` to the end for other options.

### Client

You can find more information on the client via it's README in the `frontend` folder.

### API

You can find more information on the api via it's README in the `backend` folder.

### MongoDB

The API used `Mongodb` for it's perisistence layer. In development it will fire up a docker container running `Mongodb` and will point the API at it.

### Adding a new package to `package.json`

Because everthing runs in Docker, you need to actually install the new packages in Docker too otherwise you would need to download all the packages to your local machine in order to update the `package-lock.json` file. So you would update your `package.json` file and run the command below, using the correct one depending on whether you are `frontend` or `backend`.

```
$ docker-compose run --rm jukebox-api npm install
$ docker-compose run --rm jukebox-client npm install
```

You can alternatively use:

```
$ docker-compose run --rm jukebox-api npm install some-npm --save
```

which will install the npm and update the `package.json` and `package-lock.json` file at the same time.

This would install the new package as well as updating the `package-local.json` file on your machine. You'll then need to stop all the containers `CTR C` and rebuild the images, as they install the npms on the image.

```
$ doc build
```

You can then start all the containers again `doc up`

### Adding a new environment variable

If you need to add a new backend environment variable, it needs to be added in the following places:

1. [`.env.example`](.env.example)
2. [`docker-compose.yml`](docker-compose.yml)  –  Add the environment variable to `services: jukebox-api: environment`
3. [`.github/workflows/nodejs.yml`](.github/workflows/nodejs.yml)  –  Add the environment variable to `jobs: build: steps: env`
4. [`backend/src/constants/env-vars-schema.js`](backend/src/constants/env-vars-schema.js)  –  Provide a regular expression to validate the value


## Deployment

Deployment requires a couple of npm's to be installed on your local machine.
```
$ npm install -g gh-pages
$ npm install -g shipit-cli
$ npm install -g shipit-deploy
```

### client

To push out a new release of the [client](frontend/) you first need just need to run:
```
$ ./scripts/deploy-client
```
This will create a `build` directory in your local `frontend` folder and then push it to Github (where the frontend is hosted). You may have to wait a min for things to propergate, but you should now have pushed a new release. You can check at https://github.com/kyan/jukebox-js/tree/gh-pages. There are ENVs you can update in the deploy scripts if you need to customise.

### api

To push out a new release of the [api](backend/) you need to run:
```
$ ./scripts/deploy-api
```
This will currently deploy a local branch named `release` so make sure it contains what you expect.

### mongodb

In production the api uses a EC2 server running mongodb and lives at `mongo.kyanmedia.net`.
