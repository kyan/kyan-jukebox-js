import MopidyApi from '../../constants/mopidy-api'
import notify from '../../utils/notify'
import Types from '../../constants'

const initalState = {
  online: false,
  volume: 0,
  playbackState: MopidyApi.PAUSED,
  radioStreamPlaying: false,
  radioStreamEnabled: false
}

const notification = (oldState, newState) => {
  if (oldState !== newState) {
    notify(`Jukebox ${newState}`)
  }
}

const jukebox = (state = initalState, action) => {
  switch (action.type) {
    case Types.CONNECTED:
      return Object.assign({}, state, {
        online: true
      })
    case Types.DISCONNECTED:
      return Object.assign({}, state, {
        online: false
      })
    case Types.UPDATE_VOLUME:
      return Object.assign({}, state, {
        volume: action.volume
      })
    case Types.UPDATE_PLAYBACK_STATE:
      notification(state.playbackState, action.state)
      return Object.assign({}, state, {
        playbackState: action.state
      })
    case Types.UPDATE_RADIO_STREAM_STATE:
      return Object.assign({}, state, {
        radioStreamPlaying: !state.radioStreamPlaying
      })
    default:
      return state
  }
}

export default jukebox
