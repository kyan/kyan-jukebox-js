# Jukebox 2.0

An WebSocket/[Mopidy](https://github.com/mopidy) event powered JukeBox client and API

## Background

This is a work-in-progress replacement for our [existing office JukeBox](https://github.com/kyan/jukebox) that was started back on *9th Jan 2009*. That was/is a [Rails](https://github.com/rails) application with many moving parts and orginally connected to [MPD](https://github.com/MusicPlayerDaemon/MPD) directly via a socket. It has been few many modernising iterations, and now uses `Mopidy` but still has the moving parts and socket connection. Things have moved fast in nearly 10 years, so it's time to make a fresh start using some new better fitting technologies.

## Overview

The Jukebox re-imagined still uses `Mopidy` but has been split into parts, Client and API, Both of which are written in `JavaScript`. Currently both the client and API live in this one repo, but in the future it will likely split into it's component parts.

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


