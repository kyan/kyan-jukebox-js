import DecorateTrack from 'decorators/mopidy/track'
import { findTracks } from 'services/mongodb/models/track'

const DecorateSearchResults = (json) => {
  return new Promise((resolve) => {
    const trackUris = json.map(data => data.uri)
    const requests = [
      findTracks(trackUris)
    ]

    Promise.all(requests).then((responses) => {
      const tracks = responses[0]
      const decoratedTracks = json.map(data => {
        const trackData = tracks.find(track => track._id === data.uri)

        if (trackData) {
          data.addedBy = trackData.addedBy
          data.metrics = trackData.metrics
        }

        return DecorateTrack(data)
      })

      return resolve(decoratedTracks)
    })
  })
}

export default DecorateSearchResults
