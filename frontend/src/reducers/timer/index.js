import Types from 'constants/common'

const initalProgressState = {
  position: 0,
  duration: 0,
  remaining: 0
}

const timer = (state = initalProgressState, action) => {
  switch (action.type) {
    case Types.UPDATE_PROGRESS_TIMER:
      return {
        position: action.position,
        duration: action.duration,
        remaining: action.duration - action.position
      }
    default:
      return state
  }
}

export default timer
