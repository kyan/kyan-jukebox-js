import Event from '../services/mongodb/models/event'
import MopidyConsts from '../constants/mopidy'
import AuthConsts from '../constants/auth'
import TransformTrack from './transformers/mopidy/track'
import TransformTracklist from './transformers/mopidy/tracklist'

const logEvent = (key, payload) => {
  const [service, passedKey] = key.split('::')
  const event = new Event({
    service,
    key: passedKey,
    payload
  })

  event.save()
}

export default function (key, data) {
  switch (key) {
    case MopidyConsts.EVENTS.PLAYBACK_STARTED:
      return TransformTrack(data.tl_track.track)
    case MopidyConsts.EVENTS.VOLUME_CHANGED:
      logEvent(key, data)
      return data.volume
    case MopidyConsts.EVENTS.PLAYBACK_STATE_CHANGED:
      return data.new_state
    case MopidyConsts.GET_CURRENT_TRACK:
      return TransformTrack(data)
    case MopidyConsts.GET_TRACKS:
      return TransformTracklist(data)
    case MopidyConsts.TRACKLIST_ADD:
      logEvent(key, data)
      return data
    case AuthConsts.AUTHENTICATE_USER:
    case AuthConsts.AUTHENTICATION_ERROR:
    case MopidyConsts.CONNECTION_ERROR:
    case MopidyConsts.EVENTS.TRACKLIST_CHANGED:
    case MopidyConsts.LIBRARY_GET_IMAGES:
    case MopidyConsts.MIXER_GET_VOLUME:
    case MopidyConsts.MIXER_SET_VOLUME:
    case MopidyConsts.PLAYBACK_GET_TIME_POSITION:
    case MopidyConsts.PLAYBACK_GET_STATE:
    case MopidyConsts.PLAYBACK_NEXT:
    case MopidyConsts.TRACKLIST_REMOVE:
    case MopidyConsts.TRACKLIST_CLEAR:
      return data
    default:
      return `BACKEND RESPONSE NOT HANDLED: ${key}`
  }
};
