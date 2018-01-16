## Kyan Jukebox Client

A ReactJS application that communicates with the JukeBox API.

### Up and running

```
$ cd jukebox-js/frontend
$ yarn install
```

### Development

To start the client for local developmemt, you'll need to start the API that lives in this repo, and then run:

`$ yarn start`

This should automatically start the app in your browser at `http://localhost:3000`. It will also restart the app if you make any file changes.

### Specs

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This applications has 100% coverage and also uses [StandardJS](https://standardjs.com/) for linting.

#### Specs (including file change watcher)

`$ yarn test`

#### Specs including Coverage (what CI runs)

`$ yarn test --coverage`

