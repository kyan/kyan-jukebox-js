import notify from '../../utils/notify'
import Types from '../../constants'

const tracklistDiff = (newList, oldList) => {
  const n = new Set(newList)
  const o = new Set(oldList.map(t => t.uri))
  return new Set([...n].filter(t => !o.has(t.uri)))
}

const notification = (oldT, newT) => {
  if (oldT.length === 0) return
  const difference = tracklistDiff(newT, oldT)
  if (difference.size === 0) return

  for (let track of difference) {
    notify(`Added ${track.name} by ${track.artist.name}`)
  }
}

const tracklist = (state = [], action) => {
  switch (action.type) {
    case Types.ADD_TRACKS:
      notification(state, action.list.map(item => item.track))
      return action.list.map(item => item.track)
    default:
      return state
  }
}

export default tracklist
