## Kyan Jukebox API

A NodeJS + Express application that communicates with the `Mopidy` Websocket interface.

### Up and running

```
$ cd jukebox-js/backend
$ yarn install
```

### Development

To start the API for local development you need to run:

`$ yarn start`

This should start the app  `ws://localhost:8000`. It will also restart the app if you make any file changes.

### Specs

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This applications has 100% coverage and also uses [StandardJS](https://standardjs.com/) for linting.

#### Specs (including file change watcher)

`$ yarn test-watch`

#### Specs including Coverage (what CI runs)

`$ yarn test --coverage`
