import DecorateTrack from './track'
import { findTracks } from '../models/track'
import ImageCache from '../utils/image-cache'
import { JBTrackPayloadInterface } from '../decorators/track'
import { DBTrackInterface, JBTrackInterface } from '../models/track'
import { DBImageInterface } from '../models/image'

const DecorateTracklist = (
  json: JBTrackInterface[]
): Promise<JBTrackPayloadInterface[]> =>
  new Promise((resolve) => {
    const uris: ReadonlyArray<string> = json.map((data) => data.uri)
    const requests: [Promise<DBTrackInterface[]>, Promise<DBImageInterface[]>] = [
      findTracks(uris),
      ImageCache.findAll(uris)
    ]

    Promise.all(requests).then((responses) => {
      const tracks: DBTrackInterface[] = responses[0]
      const images: any[] = responses[1]
      const decoratedTracks = json.map((data) => {
        const trackData = tracks.find((track) => track._id === data.uri)
        const imageData = images.find((image) => image._id === data.uri)

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

export default DecorateTracklist
