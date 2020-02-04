import Types from 'constants/common'

const tracklist = (state = [], action) => {
  switch (action.type) {
    case Types.ADD_TRACKS:
      return action.list.map(item => item.track)
    case Types.SYNC_SOCIAL_DATA:
      return state.map(item => {
        if (item.uri === action.track.uri) {
          return Object.assign({}, item, {
            addedBy: action.track.addedBy,
            metrics: action.track.metrics
          })
        }

        return item
      })
    default:
      return state
  }
}

export default tracklist
