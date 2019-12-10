import settings from 'utils/local-storage'
import SettingsConsts from 'constants/settings'
import EventLogger from 'utils/event-logger'
import logger from 'config/winston'
import SpotifyWebApi from 'spotify-web-api-node'
import _ from 'lodash'

const countryCode = 'GB'
const newTracksAddedLimit = process.env.SPOTIFY_NEW_TRACKS_ADDED_LIMIT
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_ID,
  clientSecret: process.env.SPOTIFY_SECRET
})

/* istanbul ignore next */
const setupSpotify = (callback) => {
  spotifyApi.clientCredentialsGrant().then(function (data) {
    logger.info(`The access token expires in ${data.body['expires_in']}`)
    logger.info(`The access token is ${data.body['access_token']}`)

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token'])

    return callback(spotifyApi)
  }, function (err) {
    logger.error(`Something went wrong when retrieving an access token: ${err.message}`)
  }).catch(function (error) {
    logger.error(`setupSpotify: ${error.message}`)
  })
}

const filterSuitableTracksUris = (tracks) => {
  const currentTrackList = settings.getItem(SettingsConsts.TRACKLIST_CURRENT)

  return _.sampleSize(
    tracks
      .filter(track => !track.explicit)
      .filter(track => !currentTrackList.includes(track.uri))
      .map(track => track.uri),
    newTracksAddedLimit
  )
}

const stripServiceFromUris = (uris) => uris.map(uri => uri.split(':').slice(-1)[0])

/* istanbul ignore next */
const getRecommendations = (uris, mopidy) => {
  if (uris.length < 1) return Promise.resolve()

  return new Promise((resolve, reject) => {
    const seedTracks = stripServiceFromUris(uris.slice(-5))
    const options = {
      country: countryCode,
      min_popularity: 20,
      seed_tracks: seedTracks,
      valence: 0.7,
      liveness: 0.0
    }

    setupSpotify((api) => {
      api.getRecommendations(options).then(
        function (data) {
          const tracks = data.body.tracks
          const suitableTracks = filterSuitableTracksUris(tracks)

          if (suitableTracks.length > 0) {
            const successHandler = response => {
              if (response) {
                EventLogger(
                  { encoded_key: 'mopidy.tracklist.add' },
                  { uris: suitableTracks },
                  response,
                  'APIRequest'
                )
              }
            }

            const failureHandler = (error) => {
              logger.error('failureHandler: ', error.message)
            }

            mopidy.tracklist.add({ uris: suitableTracks }).then(successHandler, failureHandler)
          }

          resolve()
        }
      ).catch(function (error) {
        logger.error(`getRecommendations: ${error.message}`)
        reject(error)
      })
    })
  })
}

/* istanbul ignore next */
const getTrack = (uri, callback) => {
  const trackUri = stripServiceFromUris([uri])[0]

  setupSpotify((api) => {
    api.getTrack(trackUri).then(
      function (data) {
        callback(data.body)
      }
    ).catch(function (error) {
      logger.error(`getTrack: ${error.message}`)
    })
  })
}

const SpotifyService = {
  canRecommend: (mopidy, callback) => {
    mopidy.tracklist.nextTrack([null]).then((data) => {
      if (!data) callback(getRecommendations)
    })
  },

  validateTrack: (uri) => {
    const tracklist = settings.getItem(SettingsConsts.TRACKLIST_CURRENT)

    return new Promise((resolve, reject) => {
      if (tracklist.includes(uri)) {
        const message = `Already in tracklist: ${uri}`
        return reject(new Error(message))
      }

      getTrack(uri, (track) => {
        if (track.explicit) {
          const message = `Is there a radio mix? - ${track.name}`
          return reject(new Error(message))
        }
        return resolve(true)
      })
    })
  }
}

export default SpotifyService
