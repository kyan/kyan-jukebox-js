import * as actions from 'actions'
import * as searchActions from 'search/actions'
import AuthApi from 'constants/auth-api'
import MopidyApi from 'constants/mopidy-api'
import SearchConst from 'search/constants'
import VoteConst from 'votes/constants'
import Payload from 'utils/payload'
import Notify from 'utils/notify'

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

const addCurrentTrack = (track, store, progress) => {
  store.dispatch(actions.addCurrentTrack(track))
  store.dispatch(actions.syncSocialData(track))
  const progressTimer = progress.set(0, track.length)
  if (store.getState().jukebox.playbackState === MopidyApi.PLAYING) progressTimer.start()
}

const addTrackList = (tracklist, store) => {
  store.dispatch(actions.addTrackList(tracklist))
}

const onMessageHandler = (store, payload, progressTimer) => {
  const { key, data, user } = Payload.decode(payload)

  switch (key) {
    case AuthApi.AUTHENTICATION_TOKEN_INVALID:
      console.error(`AUTHENTICATION_TOKEN_INVALID: ${data.error}`)
      store.dispatch(actions.clearToken())
      break
    case MopidyApi.PLAYBACK_GET_CURRENT_TRACK:
    case MopidyApi.EVENT_TRACK_PLAYBACK_STARTED:
      if (data && data.track) addCurrentTrack(data.track, store, progressTimer)
      break
    case MopidyApi.EVENT_PLAYBACK_STATE_CHANGED:
    case MopidyApi.PLAYBACK_GET_PLAYBACK_STATE:
      playBackChanged(store, data, progressTimer)
      break
    case MopidyApi.TRACKLIST_GET_TRACKS:
      addTrackList(data, store)
      break
    case MopidyApi.PLAYBACK_NEXT:
    case MopidyApi.PLAYBACK_BACK:
      store.dispatch(actions.getCurrentTrack())
      break
    case MopidyApi.SET_VOLUME:
      Notify.info({
        title: 'Volume Updated',
        message: `${user.fullname} changed it to ${data.volume}`
      })
      break
    case MopidyApi.TRACKLIST_REMOVE_TRACK:
      Notify.warning({
        title: 'Track Removed',
        message: `${user.fullname} removed: ${data.message}`
      })
      break
    case MopidyApi.TRACKLIST_ADD_TRACK:
      Notify.success({
        title: 'New Track',
        message: `${user.fullname} added: ${data.message}`
      })
      break
    case MopidyApi.GET_VOLUME:
    case MopidyApi.EVENT_VOLUME_CHANGED:
      store.dispatch(actions.updateVolume(data.volume))
      break
    case MopidyApi.PLAYBACK_GET_TIME_POSITION:
      progressTimer.set(data)
      break
    case SearchConst.SEARCH_GET_TRACKS:
      store.dispatch(searchActions.storeSearchResults(data))
      break
    case VoteConst.VOTE_CASTED:
      if (data) {
        store.dispatch(actions.syncSocialData(data))
      }
      break
    case MopidyApi.EVENT_PLAYBACK_STATE_RESUMED:
      progressTimer.set(data)
      break
    case MopidyApi.VALIDATION_ERROR:
      Notify.warning({
        title: 'Oops',
        message: data.message
      })
      break
    default:
      break
  }
}

export default onMessageHandler
