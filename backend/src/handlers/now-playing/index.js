import HttpService from 'services/http'

const NowPlaying = {
  addTrack: (track) => {
    if (process.env.NOW_PLAYING_URL) {
      HttpService.post({
        url: `${process.env.NOW_PLAYING_URL}`,
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
