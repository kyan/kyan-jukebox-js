import settings from '../../local-storage'
import SettingsConsts from '../../constants/settings'
import logger from '../../../config/winston'
import SpotifyWebApi from 'spotify-web-api-node'
import _ from 'lodash'

const countryCode = 'GB'
const newTracksAddedLimit = 2

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
  if (uris.length < 1) return

  const seedTracks = stripServiceFromUris(uris.slice(-5))
  const options = {
    country: countryCode,
    min_popularity: 70,
    min_tempo: 140,
    seed_tracks: seedTracks,
    valence: 0.8
  }

  setupSpotify((api) => {
    api.getRecommendations(options).then(
      function (data) {
        const tracks = data.body.tracks
        const suitableTracks = filterSuitableTracksUris(tracks)

        if (suitableTracks.length > 0) {
          logger.info(`Adding recommended tracks: ${suitableTracks} based on ${seedTracks.join(',')}`)
          mopidy.tracklist.add({ uris: suitableTracks })
        }
      }
    ).catch(function (error) {
      logger.error(`getRecommendations: ${error.message}`)
    })
  })
}

const SpotifyService = {
  canRecommend: (mopidy, callback) => {
    mopidy.tracklist.nextTrack([null]).then((data) => {
      if (!data) callback(getRecommendations)
    })
  }
}

export default SpotifyService
