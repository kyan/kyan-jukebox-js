import Mopidy from 'mopidy'
import Constants from '../constants/mopidy'
import DecorateTracklist from '../decorators/tracklist'
import NowPlaying from '../utils/now-playing'
import Spotify from '../services/spotify'
import {
  addToTrackSeedList,
  clearState,
  removeFromSeeds,
  trimTracklist,
  updateCurrentTrack,
  updateTracklist,
  getSeedTracks
} from '../models/setting'
import { addTracks, updateTrackPlaycount } from '../models/track'

const clearSetTimeout = (timeout: number) => {
  clearTimeout(timeout)
  timeout = null
}

const recommendTracks = (recommendFunc: Function, trackLength: number, mopidy: Mopidy) => {
  if (!recommendFunc) return

  getSeedTracks().then(uris => {
    const waitToRecommend = trackLength / 4 * 3
    clearSetTimeout(recommendTimer)
    recommendTimer = setTimeout(recommendFunc, waitToRecommend, uris, mopidy)
  })
}

let recommendTimer: number

const MopidyDecorator = {
  mopidyCoreMessage: (headers: any, data: any, mopidy: Mopidy): Promise<any> => {
    return new Promise((resolve) => {
      const { key } = headers

      switch (key) {
        case Constants.CORE_EVENTS.PLAYBACK_ENDED:
          return DecorateTracklist([data.tl_track.track])
            .then(data => {
              return addToTrackSeedList(data[0].track)
                .then(() => trimTracklist(mopidy))
                .then(() => resolve(data[0].track.uri))
            })
        case Constants.CORE_EVENTS.PLAYBACK_STARTED:
          return updateTrackPlaycount(data.tl_track.track.uri)
            .then(() => DecorateTracklist([data.tl_track.track]))
            .then(async data => {
              const payload = data[0]
              NowPlaying.addTrack(payload.track)

              await updateCurrentTrack(payload.track.uri)
              const recommend = await Spotify.canRecommend(mopidy)
              recommendTracks(recommend, payload.track.length, mopidy)
              return resolve(payload)
            })
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
    return new Promise(resolve => {
      const { key, user } = headers

      switch (key) {
        case Constants.GET_CURRENT_TRACK:
          if (!data) return resolve()
          return DecorateTracklist([data])
            .then(TransformedData => {
              const trackInfo = TransformedData[0]
              return updateCurrentTrack(trackInfo.track.uri).then(() => resolve(trackInfo))
            })
        case Constants.GET_TRACKS:
          return DecorateTracklist(data).then(tracks => {
            return updateTracklist(tracks.map(data => data.track.uri))
              .then(() => resolve(tracks))
          })
        case Constants.TRACKLIST_REMOVE:
          return removeFromSeeds(data[0].track.uri)
            .then(() => DecorateTracklist([data[0].track]))
            .then((response) => {
              return resolve({
                message: `${response[0].track.name} by ${response[0].track.artist.name}`,
                toAll: true
              })
            })
        case Constants.TRACKLIST_ADD:
          const { data: track } = headers
          return addTracks([track.uris[0]], user)
            .then(() => DecorateTracklist([data[0].track]))
            .then((response) => {
              clearSetTimeout(recommendTimer)
              return resolve({
                message: `${response[0].track.name} by ${response[0].track.artist.name}`,
                toAll: true
              })
            })
        case Constants.PLAYBACK_NEXT:
        case Constants.PLAYBACK_PREVIOUS:
          clearSetTimeout(recommendTimer)
          return resolve()
        case Constants.TRACKLIST_CLEAR:
          return clearState().then(() => resolve(data))
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
