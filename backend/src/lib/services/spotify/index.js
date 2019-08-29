import logger from '../../../config/winston'
import SpotifyWebApi from 'spotify-web-api-node'

/* istanbul ignore next */
const setupSpotify = (callback) => {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_ID,
    clientSecret: process.env.SPOTIFY_SECRET
  })
  spotifyApi.clientCredentialsGrant().then(function (data) {
    logger.info(`The access token expires in ${data.body['expires_in']}`)
    logger.info(`The access token is ${data.body['access_token']}`)

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token'])

    callback(spotifyApi)
  }, function (err) {
    logger.info(`Something went wrong when retrieving an access token: ${err.message}`)
  })
}

/* istanbul ignore next */
const recommendTracks = (uris, mopidy) => {
  const guids = uris.slice(-5).map(uri => uri.split(':').slice(-1)[0])

  const options = {
    limit: 2,
    country: 'GB',
    min_tempo: 140,
    min_popularity: 70,
    seed_tracks: guids
  }

  setupSpotify((api) => {
    api.getRecommendations(options).then(
      function (data) {
        const uris = []
        const tracks = data.body.tracks

        tracks.forEach(track => {
          if (!track.explicit) uris.push(track.uri)
        })

        if (uris.length > 0) {
          logger.info(`Adding recommended tracks: ${uris} based on ${guids.join(',')}`)
          mopidy.tracklist.add({ uris })
        } else {
          // TODO Pick some fresh new music to play
        }
      }
    ).catch(function (error) {
      logger.error(error)
    })
  })
}

const SpotifyService = {
  canRecommend: (mopidy, callback) => {
    mopidy.tracklist.nextTrack([null]).then((data) => {
      if (!data) callback(recommendTracks)
    })
  }
}

export default SpotifyService
