import Types from 'constants/common'

const track = (state = null, action) => {
  switch (action.type) {
    case Types.ADD_CURRENT_TRACK:
      return action.track
    case Types.SYNC_SOCIAL_DATA:
      return Object.assign({}, state, {
        addedBy: action.track.addedBy,
        metrics: action.track.metrics
      })
    default:
      return state
  }
}

export default track
