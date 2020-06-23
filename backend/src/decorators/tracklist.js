import DecorateTrack from '../decorators/track'
import { findTracks } from '../models/track'
import ImageCache from '../utils/image-cache'

const DecorateTracklist = (json) => (
  new Promise((resolve) => {
    const uris = json.map(data => data.uri)
    const requests = [
      findTracks(uris),
      ImageCache.findAll(uris)
    ]

    Promise.all(requests).then((responses) => {
      const tracks = responses[0]
      const images = responses[1]
      const decoratedTracks = json.map(data => {
        const trackData = tracks.find(track => track._id === data.uri)
        const imageData = images.find(image => image._id === data.uri)

        if (trackData) {
          data.addedBy = trackData.addedBy
          data.metrics = trackData.metrics
        }
        if (imageData) data.image = imageData.url

        return DecorateTrack(data)
      })

      return resolve(decoratedTracks)
    })
  })
)

export default DecorateTracklist
