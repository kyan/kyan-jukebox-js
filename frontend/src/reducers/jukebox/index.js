import MopidyApi from '../../constants/mopidy-api'
import Types from '../../constants'

const initalState = {
  online: false,
  volume: 0,
  playbackState: MopidyApi.PAUSED
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
      return Object.assign({}, state, {
        playbackState: action.state
      })
    default:
      return state
  }
}

export default jukebox
