import MessageType from 'constants/message'
import EventLogger from 'utils/event-logger'
import MopidyConstants from 'constants/mopidy'
import logger from 'config/logger'
import ImageCache from 'utils/image-cache'
import SpotifyWebApi from 'spotify-web-api-node'
import Recommend from 'utils/recommendations'
import { addTracks } from 'services/mongodb/models/track'
import { getTracklist } from 'services/mongodb/models/setting'

const countryCode = 'GB'
const defaultOptions = { market: countryCode }
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_ID,
  clientSecret: process.env.SPOTIFY_SECRET
})

const stripServiceFromUris = (uris) => uris.map(uri => uri.split(':').slice(-1)[0])

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

const searchTracks = (params) => {
  return new Promise((resolve) => {
    setupSpotify((api) => {
      const options = { ...defaultOptions, ...params.options }
      api.searchTracks(params.query, options)
        .then((data) => {
          ImageCache.addAll(Recommend.getImageFromSpotifyTracks(data.body.tracks.items))
          return resolve(data.body)
        })
        .catch((error) => logger.error(`searchTracks: ${error.message}`))
    })
  })
}

const getSpotifyTracks = (uris) => {
  return new Promise((resolve) => {
    const trackUris = stripServiceFromUris(uris)

    setupSpotify((api) => {
      api.getTracks(trackUris, defaultOptions)
        .then((data) => {
          ImageCache.addAll(Recommend.getImageFromSpotifyTracks(data.body.tracks)).then(() => {
            return resolve(data.body)
          })
        })
    })
  })
}

/* istanbul ignore next */
const getRecommendations = (uris, mopidy) => {
  if (uris.length < 1) return Promise.resolve()

  return new Promise((resolve, reject) => {
    const seedTracks = stripServiceFromUris(uris.slice(-5))
    const seedOptions = {
      seed_tracks: seedTracks,
      min_popularity: 30,
      min_valence: 0.5,
      max_liveness: 0.2,
      max_duration_ms: 480000,
      max_speechiness: 0.4
    }
    const options = { ...defaultOptions, ...seedOptions }

    setupSpotify(api => {
      api.getRecommendations(options)
        .then(data => Recommend.extractSuitableData(data.body.tracks))
        .then(data => Recommend.addRandomUris(data))
        .then(data => {
          const { images, uris } = data

          if (uris.length > 0) {
            const successHandler = user => response => {
              if (response) {
                const payload = {
                  ...{ user },
                  ...{ key: MopidyConstants.TRACKLIST_ADD },
                  ...{ data: uris },
                  ...{ response }
                }
                EventLogger.info(MessageType.INCOMING_MOPIDY, payload, true)
              }
            }

            const failureHandler = (error) => {
              logger.error('failureHandler: ', error.message)
            }

            ImageCache.addAll(images).then(() => {
              addTracks(uris).then((data) => {
                mopidy.tracklist.add({ uris: data.uris })
                  .then(successHandler(data.user), failureHandler)
              })
            })
          }

          return resolve()
        })
        .catch(function (error) {
          logger.error(`getRecommendations: ${error.message}`)
          return reject(error)
        })
    })
  })
}

const SpotifyService = {
  canRecommend: (mopidy) => {
    return new Promise((resolve) => {
      return mopidy.tracklist.nextTrack([null])
        .then((data) => {
          if (!data) return resolve(getRecommendations)
          return resolve()
        })
        .catch((error) => logger.error(`nextTrack: ${error.message}`))
    })
  },

  validateTrack: (uri) => {
    return new Promise((resolve, reject) => {
      return getTracklist()
        .then(uris => {
          if (uris.includes(uri)) {
            const message = `You've already added: ${uri}`
            return reject(new Error(message))
          }

          return SpotifyService.getTracks([uri])
            .then((response) => {
              const track = response.tracks[0]

              if (track.explicit && process.env.EXPLICIT_CONTENT === 'false') {
                const message = `Not suitable. Is there a radio mix? - ${track.name}`
                return reject(new Error(message))
              }
              return resolve(true)
            })
            .catch((error) => logger.error(`getTracks: ${error.message}`))
        })
    })
  },

  search: params => searchTracks(params),
  getTracks: uris => getSpotifyTracks(uris)
}

export default SpotifyService
