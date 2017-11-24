const track = (state = null, action) => {
  switch (action.type) {
    case 'ADD_CURRENT_TRACK':
      return action.track
    default:
      return state
  }
}

export default track
