# Jukebox 2.0

[![Codeship Status for kyan/jukebox-js](https://app.codeship.com/projects/586a0390-c700-0135-502a-06e1aecc9cf3/status?branch=master)](https://app.codeship.com/projects/261300)

An WebSocket/[Mopidy](https://github.com/mopidy) event powered JukeBox client and API

## Background

This is a work-in-progress replacement for our [existing office JukeBox](https://github.com/kyan/jukebox) that was started back on *9th Jan 2009*. That was/is a [Rails](https://github.com/rails) application with many moving parts and orginally connected to [MPD](https://github.com/MusicPlayerDaemon/MPD) directly via a socket. It has been through many modernising iterations, and now uses `Mopidy` but still has the moving parts and uses a socket connection (which now needs buffering). Things have moved fast in nearly 10 years, so it's time to make a fresh start using some new better fitting technologies.

## Overview

The Jukebox re-imagined still uses `Mopidy` but has been split into parts, Client and API, Both of which are written in `JavaScript`. It also uses smaller events messages passed back and forth over a websocket. Currently both the client and API live in this one repo, but in the future it will likely split into it's component parts.

## Requirements

Genreral requirements are to have [NodeJS](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/en/) installed. I recommend using [n](https://github.com/tj/n) as a great node version manager.

```
$ git clone https://github.com/kyan/jukebox-js
$ cd jukebox-js
```

### Client

You can find more information on the client via it's README in the `frontend` folder.

### API

You can find more information on the api via it's README in the `backend` folder.

### Docker

You can currently run everything Docker if you wish. From the root of the repo, you just need to run:

```
$ docker-compose up
```

This will give you a give you a working client and API. The client is available http://localhost:3000 running in dev mode, meaning any changes will cause the server to restart. By default the API will be talking to the live Mopidy instance in the office. You can change this by updating the `WS_MOPIDY` ENV in the `backend` app. You can also change the ENV `REACT_APP_WS_URL` in the `frontend` app to point to the deployed API `jukebox-api.local`

#### Specs

You can run the `frontend` specs with:

```
$ docker-compose run jukebox-client yarn test
```

You can run the `backend` specs with:

```
$ docker-compose run jukebox-api yarn test
```


