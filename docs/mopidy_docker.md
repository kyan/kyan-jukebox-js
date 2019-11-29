## Mopidy within Docker

As an alternative to [using a Raspberry Pi](docs/mopidy_install.md), Mopidy can be run locally using Docker by running the commands:

```
$ make build-all
$ make serve-all
```

Alongside Mopidy, this also runs the [Iris](https://github.com/jaedb/Iris) front-end, accessible at http://localhost:6680/iris - which can be used to browse for and add tracks to the playlist.

### Note

Audio playback is currently not supported when running Mopidy from within Docker, although this should hopefully be possible eventually (some of the PulseAudio config is already in place).
