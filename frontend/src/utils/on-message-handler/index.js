import * as actions from 'actions'
import * as searchActions from 'search/actions'
import AuthApi from 'constants/auth-api'
import MopidyApi from 'constants/mopidy-api'
import SearchConst from 'search/constants'
import VoteConst from 'votes/constants'
import Payload from 'utils/payload'
import notify from 'utils/notify'

const updatePlaybackState = (store, state) => {
  store.dispatch(actions.updatePlaybackState(state))
}

const playBackChanged = (store, state, progress) => {
  switch (state) {
    case MopidyApi.PAUSED:
    case MopidyApi.STOPPED:
      updatePlaybackState(store, state)
      progress.stop()
      notify.success('Jukebox Halted')
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
  const { key, data } = Payload.decode(payload)

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
    case MopidyApi.TRACKLIST_ADD_TRACK:
      const track = data.track
      notify.success(`Adding: ${track.name} / ${track.album.name} by ${track.artist.name}`)
      break
    case MopidyApi.PLAYBACK_NEXT:
    case MopidyApi.PLAYBACK_BACK:
      store.dispatch(actions.getCurrentTrack())
      break
    case MopidyApi.GET_VOLUME:
      store.dispatch(actions.updateVolume(data))
      break
    case MopidyApi.EVENT_VOLUME_CHANGED:
      store.dispatch(actions.updateVolume(data))
      notify.success('Volume Changed')
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
    case MopidyApi.VALIDATION_ERROR:
      notify.warning(data)
      break
    case MopidyApi.EVENT_PLAYBACK_STATE_RESUMED:
      progressTimer.set(data)
      break
    default:
      break
  }
}

export default onMessageHandler
