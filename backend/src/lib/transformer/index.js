import Mopidy from '../constants/mopidy'
import Auth from '../constants/auth'
import Settings from '../constants/settings'
import TransformTrack from './transformers/mopidy/track'
import TransformTracklist from './transformers/mopidy/tracklist'
import trackListTrimmer from '../services/mopidy/tracklist-trimmer'
import settings from '../local-storage'
import Spotify from '../services/spotify'

export default function (key, data, mopidy) {
  let recommendTimer

  switch (key) {
    case Mopidy.EVENTS.PLAYBACK_STARTED:
      const payload = TransformTrack(data.tl_track.track)
      settings.addToUniqueArray(Settings.TRACKLIST_LAST_PLAYED, payload.track.uri, 10)
      settings.setItem(Settings.TRACK_CURRENT, payload.track.uri)
      trackListTrimmer(mopidy)

      Spotify.canRecommend(mopidy, (recommend) => {
        const waitToRecommend = payload.track.length / 4 * 3
        const lastTracksPlayed = settings.getItem(Settings.TRACKLIST_LAST_PLAYED) || []

        recommendTimer = setTimeout(recommend, waitToRecommend, lastTracksPlayed, mopidy)
      })

      return payload
    case Mopidy.EVENTS.VOLUME_CHANGED:
      return data.volume
    case Mopidy.EVENTS.PLAYBACK_STATE_CHANGED:
      return data.new_state
    case Mopidy.GET_CURRENT_TRACK:
      const trackInfo = TransformTrack(data)
      settings.setItem(Settings.TRACK_CURRENT, trackInfo.track.uri)
      return trackInfo
    case Mopidy.GET_TRACKS:
      const tracks = TransformTracklist(data)
      settings.setItem(Settings.TRACKLIST_CURRENT, tracks.map(data => data.track.uri))
      return tracks
    case Mopidy.TRACKLIST_ADD:
    case Mopidy.PLAYBACK_NEXT:
    case Mopidy.TRACKLIST_CLEAR:
    case Mopidy.EVENTS.TRACKLIST_CHANGED:
      clearTimeout(recommendTimer)
      return data
    case Mopidy.TRACKLIST_REMOVE:
    case Auth.AUTHENTICATE_USER:
    case Auth.AUTHENTICATION_ERROR:
    case Mopidy.CONNECTION_ERROR:
    case Mopidy.LIBRARY_GET_IMAGES:
    case Mopidy.MIXER_GET_VOLUME:
    case Mopidy.MIXER_SET_VOLUME:
    case Mopidy.PLAYBACK_GET_TIME_POSITION:
    case Mopidy.PLAYBACK_GET_STATE:
      return data
    default:
      return `BACKEND RESPONSE NOT HANDLED: ${key}`
  }
};
