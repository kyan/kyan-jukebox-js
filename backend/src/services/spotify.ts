import SpotifyWebApi from 'spotify-web-api-node'
import MessageType from '../constants/message'
import EventLogger from '../utils/event-logger'
import MopidyConstants from '../constants/mopidy'
import logger from '../config/logger'
import ImageCache from '../utils/image-cache'
import Recommend from '../utils/recommendations'
import { addTracks } from '../models/track'
import { getTracklist } from '../models/setting'
import Mopidy from 'mopidy'
import { DBUserInterface } from '../models/user'
import { SuitableDataInterface } from '../utils/recommendations'

interface SearchInterface {
  query: string
  options: {
    offset: number
    limit: number
  }
}

export type GetRecommendationsInterface = (
  uris: ReadonlyArray<string>,
  mopidy: Mopidy
) => Promise<void>

const countryCode = 'GB'
const defaultOptions = { market: countryCode }
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_ID,
  clientSecret: process.env.SPOTIFY_SECRET
})

const stripServiceFromUris = (uris: ReadonlyArray<string>) => {
  return uris.map(uri => uri.split(':').slice(-1)[0])
}

/* istanbul ignore next */
const setupSpotify = (callback: (api: SpotifyWebApi) => void): void => {
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

const searchTracks = (params: SearchInterface): Promise<any> => (
  new Promise((resolve) => {
    setupSpotify((api) => {
      const options = { ...defaultOptions, ...params.options }
      api.searchTracks(params.query, options)
        .then((data) => {
          ImageCache.addAll(Recommend.getImageFromSpotifyTracks(data.body.tracks.items))
          resolve(data.body)
        })
        .catch((error) => logger.error(`searchTracks: ${error.message}`))
    })
  })
)

const getSpotifyTracks = (
  uris: ReadonlyArray<string>
): Promise<SpotifyApi.MultipleTracksResponse> => (
  new Promise((resolve) => {
    const trackUris = stripServiceFromUris(uris)

    setupSpotify((api: SpotifyWebApi) => {
      api.getTracks(trackUris, defaultOptions)
        .then((data) => {
          ImageCache.addAll(Recommend.getImageFromSpotifyTracks(data.body.tracks)).then(() => {
            resolve(data.body)
          })
        })
    })
  })
)

/* istanbul ignore next */
const getRecommendations: GetRecommendationsInterface = (
  uris: ReadonlyArray<string>,
  mopidy: Mopidy
) => {
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

    setupSpotify((api: SpotifyWebApi) => {
      api.getRecommendations(options)
        .then(data => {
          const tracks = data.body.tracks as SpotifyApi.TrackObjectFull[]
          return Recommend.extractSuitableData(tracks)
        })
        .then(data => Recommend.addRandomUris(data))
        .then(data => {
          const { images, uris }: SuitableDataInterface = data

          if (uris.length > 0) {
            const successHandler = (user: DBUserInterface) => (response: any) => {
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

            const failureHandler = (error: any) => {
              logger.error('failureHandler: ', error.message)
            }

            ImageCache.addAll(images).then(() => {
              addTracks(uris).then((data) => {
                mopidy.tracklist.add({ uris: data.uris })
                  .then(successHandler(data.user), failureHandler)
              })
            })
          }

          resolve()
        })
        .catch(function (error) {
          logger.error(`getRecommendations: ${error.message}`)
          reject(error)
        })
    })
  })
}

const SpotifyService = {
  canRecommend: (mopidy: Mopidy): Promise<GetRecommendationsInterface | null> => (
    new Promise(resolve => {
      return mopidy.tracklist.getNextTlid()
        .then((tlid) => {
          if (!tlid) return resolve(getRecommendations)
          resolve()
        })
        .catch((error) => logger.error(`nextTrack: ${error.message}`))
    })
  ),

  validateTrack: (uri: string) => (
    new Promise((resolve, reject) => {
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
              resolve(true)
            })
            .catch((error) => logger.error(`getTracks: ${error.message}`))
        })
    })
  ),

  search: (params: SearchInterface) => searchTracks(params),
  getTracks: (uris: ReadonlyArray<string>) => getSpotifyTracks(uris)
}

export default SpotifyService
