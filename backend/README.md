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

This should start the app  `ws://localhost:8080`. It will also restart the app if you make any file changes.

### Specs

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This applications has 100% coverage and also uses [StandardJS](https://standardjs.com/) for linting.

#### Specs (including file change watcher)

`$ yarn test-watch`

#### Specs including Coverage (what CI runs)

`$ yarn test --coverage`

### API

The API is a proxy between the various services and the JukeBox Client. The Client connects to the API via a websocket and can send and recieve messages that get send up and down the open connection. Primarily the API connects to `Mopidy` and relays messages to and from it and passes them down to the connected clients. This allows us to intercept these messages and do things like adding extra meta data or reformatting those messages completely.

#### Payload

The messages that pass to and from the client are packaged in a defined format. Here's a couple of simple examples:

```
# Incoming message from connected clients

{
  key: 'mopidy::mixer.setVolume',
  data: [12]
}

# Outgoing message to connected clients

{
  key: 'mopidy::event:volumeChanged',
  data: 16
}
```
