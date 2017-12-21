import * as actions from '../../actions'
import MopidyApi from '../../constants/mopidy-api'

const playBackChanged = (state, progress) => {
  switch (state) {
    case 'paused':
    case 'stopped':
      progress.stop()
      break
    case 'playing':
      progress.start()
      break
    default:
      break
  }
}

const addCurrentTrack = (track, store, progress) => {
  store.dispatch(actions.addCurrentTrack(track))
  progress.set(0, track.length).start()
  store.dispatch(actions.getImage(track.album.uri))
}

const addTrackList = (tracklist, store) => {
  store.dispatch(actions.addTrackList(tracklist))
  tracklist.forEach(item => {
    store.dispatch(actions.getImage(item.track.album.uri))
  })
}

const onMessageHandler = (store, payload, progressTimer) => {
  let { key, data } = JSON.parse(payload)

  switch (key) {
    case MopidyApi.PLAYBACK_GET_CURRENT_TRACK:
    case MopidyApi.EVENT_TRACK_PLAYBACK_STARTED:
      addCurrentTrack(data.track, store, progressTimer)
      break
    case MopidyApi.EVENT_PLAYBACK_STATE_CHANGED:
      playBackChanged(data.new_state, progressTimer)
      break
    case MopidyApi.EVENT_TRACKLIST_CHANGED:
      store.dispatch(actions.getTrackList())
      break
    case MopidyApi.TRACKLIST_GET_TRACKS:
      addTrackList(data, store)
      break
    case MopidyApi.GET_VOLUME:
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
