import Types from '../../constants'

const tracklist = (state = [], action) => {
  switch (action.type) {
    case Types.ADD_TRACKS:
      return action.list.map(item => item.track)
    default:
      return state
  }
}

export default tracklist
