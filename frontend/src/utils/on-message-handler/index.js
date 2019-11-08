import * as actions from '../../actions'
import AuthApi from '../../constants/auth-api'
import MopidyApi from '../../constants/mopidy-api'
import Payload from '../../utils/payload'

const updatePlaybackState = (store, state) => {
  store.dispatch(actions.updatePlaybackState(state))
}

const playBackChanged = (store, state, progress) => {
  switch (state) {
    case MopidyApi.PAUSED:
    case MopidyApi.STOPPED:
      updatePlaybackState(store, state)
      progress.stop()
      break
    case MopidyApi.PLAYING:
      updatePlaybackState(store, state)
      progress.start()
      break
    default:
      break
  }
}

const imageUriChooser = (track) => {
  if (track.composer) return track.composer.uri
  return track.album.uri
}

const addCurrentTrack = (track, store, progress) => {
  if (!track) return
  store.dispatch(actions.addCurrentTrack(track))
  progress.set(0, track.length).start()
  store.dispatch(actions.getImage(imageUriChooser(track)))
}

const addTrackList = (tracklist, store) => {
  store.dispatch(actions.addTrackList(tracklist))
  tracklist.forEach(item => {
    store.dispatch(actions.getImage(imageUriChooser(item.track)))
  })
}

const onMessageHandler = (store, payload, progressTimer) => {
  const { key, data } = Payload.decode(payload)

  switch (key) {
    case AuthApi.AUTHENTICATION_TOKEN_INVALID:
      console.log(`AUTHENTICATION_TOKEN_INVALID: ${data.error}`)
      store.dispatch(actions.clearToken())
      break
    case MopidyApi.PLAYBACK_GET_CURRENT_TRACK:
    case MopidyApi.EVENT_TRACK_PLAYBACK_STARTED:
      addCurrentTrack(data.track, store, progressTimer)
      break
    case MopidyApi.EVENT_PLAYBACK_STATE_CHANGED:
    case MopidyApi.PLAYBACK_GET_PLAYBACK_STATE:
      playBackChanged(store, data, progressTimer)
      break
    case MopidyApi.EVENT_TRACKLIST_CHANGED:
      store.dispatch(actions.getTrackList())
      break
    case MopidyApi.TRACKLIST_GET_TRACKS:
      addTrackList(data, store)
      break
    case MopidyApi.GET_VOLUME:
      store.dispatch(actions.updateVolume(data))
      break
    case MopidyApi.EVENT_VOLUME_CHANGED:
      store.dispatch(actions.updateVolume(data))
      break
    case MopidyApi.LIBRARY_GET_IMAGES:
      store.dispatch(actions.resolveImage(data))
      break
    case MopidyApi.PLAYBACK_GET_TIME_POSITION:
      progressTimer.set(data)
      break
    default:
      console.log(`Unknown message: ${key} body: ${data}`)
      break
  }
}

export default onMessageHandler
