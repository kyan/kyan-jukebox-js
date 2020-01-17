import TransformTrack from 'utils/transformer/transformers/mopidy/track'
import { findTracks } from 'services/mongodb/models/track'
import ImageCache from 'utils/image-cache'

const TransformerTracklist = (json) => {
  return new Promise((resolve) => {
    const trackUris = json.map(data => data.uri)
    const imageUris = json.filter(data => data.album).map(data => data.album.uri)
    const requests = [
      findTracks(trackUris),
      ImageCache.findAll(imageUris)
    ]

    Promise.all(requests).then((responses) => {
      const tracks = responses[0]
      const images = responses[1]
      const decoratedTracks = json.map(data => {
        const trackData = tracks.find(track => track._id === data.uri)
        const imageData = images.find(image => image._id === (data.album && data.album.uri))

        if (trackData) data.addedBy = trackData.addedBy.reverse()
        if (imageData) data.image = imageData.url

        return TransformTrack(data)
      })

      return resolve(decoratedTracks)
    })
  })
}

export default TransformerTracklist
