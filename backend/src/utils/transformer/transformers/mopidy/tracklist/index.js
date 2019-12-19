import TransformTrack from 'utils/transformer/transformers/mopidy/track'
import { findTracks } from 'utils/track'

const Tracklist = (json) => {
  return new Promise((resolve) => {
    const trackUris = json.map(data => data.uri)
    findTracks(trackUris).then(tracks => {
      const decoratedTracks = json.map(data => {
        const trackData = tracks.find(track => track._id === data.uri)
        if (trackData) { data.addedBy = trackData.addedBy.map(user => user[0]) }
        return TransformTrack(data)
      })
      resolve(decoratedTracks)
    })
  })
}

export default Tracklist
