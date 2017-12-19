import Types from '../../constants'

const initalState = {
  online: false
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
    default:
      return state
  }
}

export default jukebox
