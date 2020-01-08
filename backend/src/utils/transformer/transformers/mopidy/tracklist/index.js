import TransformTrack from 'utils/transformer/transformers/mopidy/track'
import { findTracks, findImages } from 'utils/track'

const Tracklist = (json) => {
  return new Promise((resolve) => {
    const trackUris = json.map(data => data.uri)
    const imageUris = json.filter(data => data.album).map(data => data.album.uri)
    const requests = [
      findTracks(trackUris),
      findImages(imageUris)
    ]

    Promise.all(requests).then((responses) => {
      const tracks = responses[0]
      const images = responses[1]
      const decoratedTracks = json.map(data => {
        const trackData = tracks.find(track => track._id === data.uri)
        const imageData = images.find(image => image.uri === (data.album && data.album.uri))

        if (trackData) {
          data.addedBy = trackData.addedBy.reverse().map(user => user[0])
        }

        if (imageData) {
          data.image = imageData.data[data.album.uri][0].uri
        }

        return TransformTrack(data)
      })

      return resolve(decoratedTracks)
    })
  })
}

export default Tracklist
