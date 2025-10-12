import Mopidy from 'mopidy'
import Constants from '../constants/mopidy'
import DecorateTracklist from '../decorators/tracklist'
import NowPlaying from '../utils/now-playing'
import Spotify from '../services/spotify'
import { getDatabase } from '../services/database/factory'
import { JBTrack } from '../types/database'
import { GetRecommendations } from '../services/spotify'

let recommendTimer: NodeJS.Timeout | null

const clearRecommendTimer = () => {
  if (recommendTimer) {
    clearTimeout(recommendTimer)
    recommendTimer = null
  }
}

const recommendTracks = (
  recommendFunc: GetRecommendations,
  trackLength: number,
  mopidy: Mopidy
): void => {
  if (!recommendFunc) return

  const db = getDatabase()
  db.settings.getSeedTracks().then((uris) => {
    const waitToRecommend = (trackLength / 4) * 3
    clearRecommendTimer()
    recommendTimer = setTimeout(recommendFunc, waitToRecommend, uris, mopidy)
  })
}

const MopidyDecorator = {
  mopidyCoreMessage: (headers: any, data: any, mopidy: Mopidy): Promise<any> => {
    return new Promise((resolve) => {
      const { key } = headers

      switch (key) {
        case Constants.CORE_EVENTS.PLAYBACK_ENDED: {
          const db = getDatabase()
          return DecorateTracklist([data.tl_track.track]).then((data) => {
            return db.settings
              .addToTrackSeedList(data[0])
              .then(() => db.settings.trimTracklist(mopidy))
              .then(() => resolve(data[0].uri))
          })
        }
        case Constants.CORE_EVENTS.PLAYBACK_STARTED: {
          const db = getDatabase()
          return db.tracks
            .updatePlaycount(data.tl_track.track.uri)
            .then(() => DecorateTracklist([data.tl_track.track]))
            .then(async (data) => {
              const payload = data[0]
              NowPlaying.addTrack(payload)

              await db.settings.updateCurrentTrack(payload.uri)
              const recommend = await Spotify.canRecommend(mopidy)
              recommendTracks(recommend, payload.length, mopidy)
              resolve(payload)
            })
        }
        case Constants.CORE_EVENTS.VOLUME_CHANGED:
          return resolve({ volume: data.volume })
        case Constants.CORE_EVENTS.PLAYBACK_STATE_CHANGED:
          return resolve(data.new_state)
        case Constants.CORE_EVENTS.PLAYBACK_RESUMED:
          return resolve(data.time_position)
        default:
          return resolve(`mopidySkippedTransform: ${key}`)
      }
    })
  },
  parse: (headers: any, data: any): Promise<any> => {
    return new Promise((resolve) => {
      const { key, user } = headers
      const db = getDatabase()

      switch (key) {
        case Constants.GET_CURRENT_TRACK:
          if (!data) return resolve(null)
          return DecorateTracklist([data]).then((TransformedData) => {
            const trackInfo = TransformedData[0]
            return db.settings
              .updateCurrentTrack(trackInfo.uri)
              .then(() => resolve(trackInfo))
          })
        case Constants.GET_TRACKS:
          return DecorateTracklist(data).then(async (tracks) => {
            await db.settings.updateTracklist(tracks.map((data) => data.uri))
            return resolve(tracks)
          })
        case Constants.TRACKLIST_REMOVE:
          return db.settings
            .removeFromSeeds(data[0].track.uri)
            .then(() => {
              const tracks: Mopidy.models.TlTrack[] = data
              return DecorateTracklist(tracks.map((item) => item.track))
            })
            .then((responses: JBTrack[]) => {
              resolve({
                message: responses.map((r) => `${r.name} by ${r.artist.name}`).join(', '),
                toAll: true
              })
            })
        case Constants.TRACKLIST_ADD:
          return db.tracks
            .addTracks(headers.data.uris, user)
            .then(() => {
              const tracks: Mopidy.models.TlTrack[] = data
              return DecorateTracklist(tracks.map((item) => item.track))
            })
            .then((responses: JBTrack[]) => {
              clearRecommendTimer()

              resolve({
                message: responses.map((r) => `${r.name} by ${r.artist.name}`).join(', '),
                toAll: true
              })
            })
        case Constants.PLAYBACK_NEXT:
        case Constants.PLAYBACK_PREVIOUS:
          clearRecommendTimer()
          return resolve(null)
        case Constants.TRACKLIST_CLEAR:
          return db.settings.clearState().then(() => resolve(data))
        case Constants.MIXER_SET_VOLUME:
          return resolve({
            volume: headers.data[0],
            toAll: true
          })
        case Constants.MIXER_GET_VOLUME:
          return resolve({ volume: data })
        case Constants.PLAYBACK_GET_TIME_POSITION:
        case Constants.PLAYBACK_GET_STATE:
        case Constants.VALIDATION_ERROR:
          return resolve(data)
        default:
          return resolve(`skippedTransform: ${key}`)
      }
    })
  }
}

export default MopidyDecorator
