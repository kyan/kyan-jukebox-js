import settings from 'utils/local-storage'
import SettingsConsts from 'constants/settings'
import MessageType from 'constants/message'
import EventLogger from 'utils/event-logger'
import logger from 'config/winston'
import ImageCache from 'utils/image-cache'
import SpotifyWebApi from 'spotify-web-api-node'
import { addTracks } from 'services/mongodb/models/track'
import { sampleSize } from 'lodash'

const countryCode = 'GB'
const defaultOptions = { market: countryCode }
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

const getImageFromSpotifyTracks = (tracks) => {
  const albumTracks = tracks.filter((track) => track.album)
  const images = albumTracks.map(track => ({ [track.album.uri]: track.album.images[0].url }))
  return Object.assign({}, ...images)
}

const searchTracks = (params) => {
  return new Promise((resolve) => {
    setupSpotify((api) => {
      const options = { ...defaultOptions, ...params.options }
      api.searchTracks(params.query, options)
        .then((data) => resolve(data.body))
        .catch((error) => logger.error(`searchTracks: ${error.message}`))
    })
  })
}

const getTracks = (uris) => {
  return new Promise((resolve) => {
    const trackUris = stripServiceFromUris(uris)

    setupSpotify((api) => {
      api.getTracks(trackUris, defaultOptions)
        .then((data) => resolve(data.body))
        .catch((error) => logger.error(`getTracks: ${error.message}`))
    })
  })
}

const filterSuitableTracksUris = (tracks) => {
  const currentTrackList = settings.getItem(SettingsConsts.TRACKLIST_CURRENT)

  return sampleSize(
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
    const seedOptions = {
      min_popularity: 20,
      seed_tracks: seedTracks,
      valence: 0.7,
      liveness: 0.0
    }
    const options = { ...defaultOptions, ...seedOptions }

    setupSpotify((api) => {
      api.getRecommendations(options).then(
        function (data) {
          const tracks = data.body.tracks
          const images = getImageFromSpotifyTracks(tracks)
          const suitableTracks = filterSuitableTracksUris(tracks)

          if (suitableTracks.length > 0) {
            const successHandler = user => response => {
              if (response) {
                const payload = {
                  ...{ user },
                  ...{ key: 'mopidy.tracklist.add' },
                  ...{ data: suitableTracks },
                  ...{ response }
                }
                EventLogger.info(MessageType.INCOMING_MOPIDY, payload, true)
              }
            }

            const failureHandler = (error) => {
              logger.error('failureHandler: ', error.message)
            }

            ImageCache.addAll(images).then(() => {
              addTracks(suitableTracks).then((data) => {
                mopidy.tracklist.add({ uris: data.uris }).then(successHandler(data.user), failureHandler)
              })
            })
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

const SpotifyService = {
  canRecommend: (mopidy) => {
    return new Promise((resolve) => {
      mopidy.tracklist.nextTrack([null])
        .then((data) => {
          if (!data) return resolve(getRecommendations)
          return resolve()
        })
        .catch((error) => logger.error(`nextTrack: ${error.message}`))
    })
  },

  validateTrack: (uri) => {
    const tracklist = settings.getItem(SettingsConsts.TRACKLIST_CURRENT)

    return new Promise((resolve, reject) => {
      if (tracklist.includes(uri)) {
        const message = `Already in tracklist: ${uri}`
        return reject(new Error(message))
      }

      getTracks([uri]).then((response) => {
        const track = response.tracks[0]
        ImageCache.addAll(getImageFromSpotifyTracks([track])).then(() => {
          if (track.explicit) {
            const message = `Not suitable. Is there a radio mix? - ${track.name}`
            return reject(new Error(message))
          }
          return resolve(true)
        })
      })
    })
  },

  search: (params) => searchTracks(params)
}

export default SpotifyService
