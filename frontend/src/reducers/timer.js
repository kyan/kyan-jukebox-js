const initalProgressState = {
  position: 0,
  duration: 0
}
const timer = (state = initalProgressState, action) => {
  switch (action.type) {
    case 'UPDATE_PROGRESS_TIMER':
      return {
        position: action.position,
        duration: action.duration
      }
    default:
      return state
  }
}

export default timer
