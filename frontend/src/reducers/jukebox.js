const initalState = {
  online: false
}
const jukebox = (state = initalState, action) => {
  switch (action.type) {
    case 'CONNECTED':
      return Object.assign({}, state, {
        online: true
      })
    case 'DISCONNECTED':
      return Object.assign({}, state, {
        online: false
      })
    default:
      return state
  }
}

export default jukebox
