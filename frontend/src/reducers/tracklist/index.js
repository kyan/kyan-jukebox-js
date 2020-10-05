import Types from 'constants/common'

const tracklist = (state = [], action) => {
  switch (action.type) {
    case Types.ADD_TRACKS:
      return action.tracks
    case Types.SYNC_SOCIAL_DATA:
      return state.map(track => {
        if (track.uri === action.track.uri) {
          return Object.assign({}, track, {
            addedBy: action.track.addedBy,
            metrics: action.track.metrics
          })
        }

        return track
      })
    default:
      return state
  }
}

export default tracklist
