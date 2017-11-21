import * as actions from '../../actions'
import Constants from '../../constants'

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
  store.dispatch(actions.addTrack(track))
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
    case Constants.PLAYBACK_GET_CURRENT_TRACK:
      addCurrentTrack(data.track, store, progressTimer)
      break
    case Constants.EVENT_TRACK_PLAYBACK_STARTED:
      addCurrentTrack(data.track, store, progressTimer)
      break
    case Constants.EVENT_PLAYBACK_STATE_CHANGED:
      playBackChanged(data.new_state, progressTimer)
      break
    case Constants.EVENT_TRACKLIST_CHANGED:
      store.dispatch(actions.getTrackList())
      break
    case Constants.TRACKLIST_GET_TRACKS:
      addTrackList(data, store)
      break
    case Constants.LIBRARY_GET_IMAGES:
      store.dispatch(actions.resolveImage(data))
      break
    case Constants.PLAYBACK_GET_TIME_POSITION:
      progressTimer.set(data)
      break
    default:
      console.log(`Unknown message: ${key} body: ${data}`)
      break
  }
}

export default onMessageHandler
