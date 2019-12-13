import TransformTrack from 'utils/transformer/transformers/mopidy/track'
import { findTrack } from 'utils/track'

const Tracklist = (json) => {
  return new Promise((resolve) => {
    const tracks = json.map(data => {
      return findTrack(data.uri).then(trackData => {
        data.user_data = trackData
        return TransformTrack(data)
      })
    })
    Promise.all(tracks).then(decoratedTracks => resolve(decoratedTracks))
  })
}

export default Tracklist
