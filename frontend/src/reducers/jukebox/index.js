import Types from '../../constants'

const initalState = {
  online: false,
  currentVolume: 0
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
        currentVolume: action.volume
      })
    default:
      return state
  }
}

export default jukebox
