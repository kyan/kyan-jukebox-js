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
  if (store.getState().jukebox.playbackState === MopidyApi.PLAYING) {
    progressTimer.start()
  }
}

const addTrackList = (tracklist, store) => {
  store.dispatch(actions.addTrackList(tracklist))
}

const onMessageHandler = (store, payload, progressTimer) => {
  const { key, data, user } = Payload.decode(payload)

  // If user is validating and we get a successful response, confirm sign-in
  const state = store.getState()
  const isValidating = state.settings.isValidating
  const pendingUser = state.settings.user

  // Helper to confirm user sign-in on successful authorized response
  const confirmUserSignIn = () => {
    if (isValidating && pendingUser && user) {
      store.dispatch(actions.updateUser(user.email, user))
    }
  }

  switch (key) {
    case MopidyApi.VALIDATE_USER:
      confirmUserSignIn()
      break
    case AuthApi.USER_NOT_FOUND: {
      console.error(`USER_NOT_FOUND: ${data.error}`)
      const errorMessage = data.error || 'User not found in database'
      Notify.warning({
        title: 'User Not Found',
        message: errorMessage
      })
      store.dispatch(actions.setAuthError(errorMessage))
      store.dispatch(actions.clearUser())
      break
    }
    case MopidyApi.PLAYBACK_GET_CURRENT_TRACK:
    case MopidyApi.EVENT_TRACK_PLAYBACK_STARTED:
      confirmUserSignIn()
      if (data) addCurrentTrack(data, store, progressTimer)
      break
    case MopidyApi.EVENT_PLAYBACK_STATE_CHANGED:
    case MopidyApi.PLAYBACK_GET_PLAYBACK_STATE:
      confirmUserSignIn()
      playBackChanged(store, data, progressTimer)
      break
    case MopidyApi.TRACKLIST_GET_TRACKS:
      confirmUserSignIn()
      addTrackList(data, store)
      break
    case MopidyApi.PLAYBACK_NEXT:
    case MopidyApi.PLAYBACK_BACK:
      confirmUserSignIn()
      store.dispatch(actions.getCurrentTrack())
      break
    case MopidyApi.SET_VOLUME:
      confirmUserSignIn()
      Notify.info({
        title: 'Volume Updated',
        message: `${user.fullname} changed it to ${data.volume}`
      })
      break
    case MopidyApi.TRACKLIST_REMOVE_TRACK:
      confirmUserSignIn()
      Notify.warning({
        title: 'Track Removed',
        message: `${user.fullname} removed: ${data.message}`
      })
      break
    case MopidyApi.TRACKLIST_ADD_TRACK:
      confirmUserSignIn()
      Notify.success({
        title: 'New Track',
        message: `${user.fullname} added: ${data.message}`
      })
      break
    case MopidyApi.GET_VOLUME:
    case MopidyApi.EVENT_VOLUME_CHANGED:
      confirmUserSignIn()
      store.dispatch(actions.updateVolume(data.volume))
      break
    case MopidyApi.PLAYBACK_GET_TIME_POSITION:
      confirmUserSignIn()
      progressTimer.set(data)
      break
    case SearchConst.SEARCH_GET_TRACKS:
      confirmUserSignIn()
      store.dispatch(searchActions.storeSearchResults(data))
      break
    case VoteConst.VOTE_CASTED:
      confirmUserSignIn()
      if (data) {
        store.dispatch(actions.syncSocialData(data))
      }
      break
    case MopidyApi.EVENT_PLAYBACK_STATE_RESUMED:
      confirmUserSignIn()
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
