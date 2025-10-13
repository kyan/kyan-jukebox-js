![jukebox-build-and-test](https://github.com/kyan/jukebox-js/workflows/jukebox-build-and-test/badge.svg)

# Jukebox 2.0

An WebSocket/[Mopidy](https://github.com/mopidy) event powered JukeBox client and API

![](docs/jb1.png)

## Background

This is a work-in-progress replacement for our [existing office JukeBox](https://github.com/kyan/jukebox) that was started back on *9th Jan 2009*. That was/is a [Rails](https://github.com/rails) application with many moving parts and orginally connected to [MPD](https://github.com/MusicPlayerDaemon/MPD) directly via a socket. It has been through many modernising iterations, and now uses `Mopidy` but still has the moving parts and uses a socket connection (which now needs buffering). Things have moved fast in nearly 10 years, so it's time to make a fresh start using some new better fitting technologies.

## Overview

The Jukebox re-imagined still uses `Mopidy` but has been split into parts, Client and API (FE and BE). The BE is written in [TypeScript](https://www.typescriptlang.org/) and the FE currently is a mix of [JavaScript](https://www.javascript.com/) and TypeScript. It uses SQLite for data persistence and communicates via smaller event messages passed back and forth over a websocket. Currently both the FE and BE live in this one monorepo.

## Why not use an existing Mopidy frontend

We have extra requirements for our office Jukebox to make it more interactive and office friendly, Mopidy just handles playing music. This projects adds some of these extra features:

* Information about who added a track to the playlist
* Ability for other users to rate the current track playling
* An auto track chooser that adds music when the playlist runs out
* Auto switch off
* Search for music ordered by previous vote popularity

## Requirements

* A machine that can run `nodejs`
* A `Google` account (for easy user management)
* A premium `Spotify` account (for the music)

```
$ git clone https://github.com/kyan/jukebox-js
$ cd jukebox-js
```

## Environment

Running the app locally requires some environment variables to be set in the various applications. There are a bunch of `.env.example` files that just need to be duplicated in the folder they are in and the various missing parts filled in. The comments in those files should help you.

## Development

The app uses `just` to make running common tasks easier, so if you run `just` or `just help` you will see all the commands you can run against the app with a simple explaination. Some of the commands take args `just <something> ARGS`

### Running the tests

There is currently 100% tests and coverage throughout the app as well as linting and prettier via ESLint.

Run all the tests in the same way it does on CI:
```
$ just test
```

Run just the tests for the FE or BE:
```
$ just fe-test
$ just be-test
$ just be-test --watchAll
$ just be-test --watchAll --coverage
```

You can also just run any of the scripts in `package.json` file of that project:
```
$ just be lint
```

You can also just ignore `just` and run everything manual if that's your thing.

### Running the app

When running the app locally you get to run a Docker instance of Mopidy on your machine. You don't get any sound but it's by far the easiest way. The SQLite database will be stored in the `databases/` folder. You just need to run:

Start the dependencies (Mopidy)
```
just deps-start
```

Note: If you are using an M1 Macbook, the above command may fail. To fix this, you will need to set the following environment variable in your shell:
```
DOCKER_DEFAULT_PLATFORM=linux/amd64
```

Now you can just open a new terminal for the FE and the BE and run:

```
just fe-serve
```
and
```
just be-serve
```

This will give you a working FE and BE with SQLite persistence. The Jukebox is available
at http://localhost:3001 running in dev mode, meaning any changes will cause the server to restart.

## Technology

### Client

A ReactJS application that communicates with the JukeBox API.

### API

A NodeJS + Express application written in TypeScript that communicates with `SQLite` for data persistence and the `Mopidy` Websocket interface.

##### TypeScript

In order to use Intellisense and TypeChecking in VSCode you will need to connect VSCode to the source running in the container as that's where all the node modules are installed. To do this you need to have the `VSCode Remote - Containers` extension installed.

You can do this in various ways. Either whilst you're serving the app locally, or just via having the `*-console` script running. You run `Remote Containers - Attach to running container...` and choose the jukebox container that you started and want to connect to. This should then start a new window connecting to the container where you can edit your code. You should now get all the Intellisense and TypeChecking working in that window.

Once you have done this once, the next time when you start the container, you should see an entry in the `Remote Exporer` containers section where you can attach again from there. You can also edit the configuration so you can install in extension you want when you are editing.

### SQLite

The API uses `SQLite` for its persistence layer. In development, the database file is stored in the `databases/` folder. In production, it should be placed at `/var/lib/jukebox/jukebox.db` and the `SQLITE_PATH` environment variable should point to this location.

### Adding a new package to `package.json`

The easiest way to do this is using `just api-console` or `just client-console` (if those commands exist), or by attaching to the running container.

Once you have a command line you can just run `$ npm install <package>`. This will install the package and update the `package.*` files. You will be able to continue development. When you shutdown the container though the package will be missing. You need to re-build the image to make it available. So remember to run `just build` when you start up next time.

### Mopidy

If you so want to run your own version of Mopidy for running in production, you can buy yourself a Raspberry Pi and follow [these instructions](docs/mopidy_install.md).

## Deployment

### Client

To push out a new release of the [FE](frontend/) you first need just need to run:
```
$ ./scripts/deploy-frontend.sh
```
This will create a `build` directory in your local `frontend` folder with the production-ready static files. The built application can then be deployed to any static hosting service or served directly from your server infrastructure.

### Api

To push out a new release of the [BE](backend/) you need to run:
```
$ ./scripts/deploy-backend.sh
```

### Database

In production the API uses SQLite. The database file should be manually copied to `/var/lib/jukebox/jukebox.db` on the host machine and the `SQLITE_PATH` environment variable should be set to this path.
