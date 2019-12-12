import HttpService from 'services/http'
import EnvVars from 'utils/env-vars'

const NowPlaying = {
  addTrack: (track) => {
    if (EnvVars.isSet('NOW_PLAYING_URL')) {
      HttpService.post({
        url: EnvVars.get('NOW_PLAYING_URL'),
        data: {
          title: track.name,
          artist: track.artist.name,
          album: track.album.name,
          added_by: 'Jukebox JS'
        }
      })
    }
  }
}

export default NowPlaying
