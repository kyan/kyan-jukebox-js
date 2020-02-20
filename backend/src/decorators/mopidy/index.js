import Mopidy from 'constants/mopidy'
import Settings from 'constants/settings'
import DecorateTrack from 'decorators/mopidy/track'
import DecorateTracklist from 'decorators/mopidy/tracklist'
import NowPlaying from 'handlers/now-playing'
import settings from 'utils/local-storage'
import Spotify from 'services/spotify'
import trackListTrimmer from 'services/mopidy/tracklist-trimmer'
import { addTracks, updateTrackPlaycount } from 'services/mongodb/models/track'

const clearSetTimeout = (timeout) => {
  clearTimeout(timeout)
  timeout = null
}

const addTrackToLastPlayedList = (track) => {
  if (track.metrics && track.metrics.votesAverage < 20) return
  settings.addToUniqueArray(Settings.TRACKLIST_LAST_PLAYED, track.uri, 10)
}

let recommendTimer

const MopidyDecorator = {
  mopidyCoreMessage: (headers, data, mopidy) => {
    return new Promise((resolve) => {
      const { key } = headers

      switch (key) {
        case Mopidy.CORE_EVENTS.PLAYBACK_ENDED:
          return DecorateTracklist([data.tl_track.track])
            .then(data => {
              addTrackToLastPlayedList(data[0].track)
              return trackListTrimmer(mopidy).then(() => resolve(data[0].track.uri))
            })
        case Mopidy.CORE_EVENTS.PLAYBACK_STARTED:
          return updateTrackPlaycount(data.tl_track.track.uri)
            .then(() => DecorateTracklist([data.tl_track.track]))
            .then(data => {
              const payload = data[0]
              const { track } = payload
              settings.setItem(Settings.TRACK_CURRENT, track.uri)
              Spotify.canRecommend(mopidy)
                .then((recommend) => {
                  if (recommend) {
                    const waitToRecommend = track.length / 4 * 3
                    const lastTracksPlayed = settings.getItem(Settings.TRACKLIST_LAST_PLAYED) || []

                    clearSetTimeout(recommendTimer)
                    recommendTimer = setTimeout(recommend, waitToRecommend, lastTracksPlayed, mopidy)
                  }
                })
              NowPlaying.addTrack(track)
              return resolve(payload)
            })
        case Mopidy.CORE_EVENTS.VOLUME_CHANGED:
          return resolve(data.volume)
        case Mopidy.CORE_EVENTS.PLAYBACK_STATE_CHANGED:
          return resolve(data.new_state)
        default:
          return resolve(`mopidySkippedTransform: ${key}`)
      }
    })
  },
  parse: (headers, data) => {
    return new Promise((resolve) => {
      const { key, user } = headers

      switch (key) {
        case Mopidy.GET_CURRENT_TRACK:
          if (!data) return resolve()
          return DecorateTracklist([data]).then(TransformedData => {
            const trackInfo = TransformedData[0]
            settings.setItem(Settings.TRACK_CURRENT, trackInfo.track.uri)
            return resolve(trackInfo)
          })
        case Mopidy.GET_TRACKS:
          return DecorateTracklist(data).then(tracks => {
            settings.setItem(Settings.TRACKLIST_CURRENT, tracks.map(data => data.track.uri))
            resolve(tracks)
          })
        case Mopidy.TRACKLIST_REMOVE:
          settings.removeFromArray(Settings.TRACKLIST_LAST_PLAYED, data[0].track.uri)
          return resolve(data)
        case Mopidy.TRACKLIST_ADD:
          const { data: track } = headers
          addTracks([track.uri], user)
        /* falls through */
        case Mopidy.PLAYBACK_NEXT:
        case Mopidy.PLAYBACK_PREVIOUS:
          clearSetTimeout(recommendTimer)
          if (data && data.length > 0) return resolve(DecorateTrack(data[0].track))
          return resolve()
        case Mopidy.TRACKLIST_CLEAR:
        case Mopidy.MIXER_GET_VOLUME:
        case Mopidy.MIXER_SET_VOLUME:
        case Mopidy.PLAYBACK_GET_TIME_POSITION:
        case Mopidy.PLAYBACK_GET_STATE:
        case Mopidy.VALIDATION_ERROR:
          return resolve(data)
        default:
          return resolve(`skippedTransform: ${key}`)
      }
    })
  }
}

export default MopidyDecorator
