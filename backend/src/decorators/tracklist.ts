import DecorateTrack from './track'
import Mopidy from 'mopidy'
import ImageCache from '../utils/image-cache'
import Track, { MopidyTrackExt, JBTrack } from '../models/track'
import Image from '../models/image'

const DecorateTracklist = (json: Mopidy.models.Track[]): Promise<JBTrack[]> =>
  new Promise((resolve) => {
    const uris: ReadonlyArray<string> = json.map((data) => data.uri)
    const requests: [Promise<Track[]>, Promise<Image[]>] = [
      Track.findTracks(uris),
      ImageCache.findAll(uris)
    ]

    Promise.all(requests).then((responses) => {
      const tracks: Track[] = responses[0]
      const images: any[] = responses[1]
      const decoratedTracks = json.map((data) => {
        const track = data as MopidyTrackExt
        const trackData = tracks.find((t) => t._id === track.uri)
        const imageData = images.find((i) => i._id === track.uri)

        if (trackData) {
          track.addedBy = trackData.addedBy
          track.metrics = trackData.metrics
        }
        if (imageData) track.image = imageData.url

        return DecorateTrack(track)
      })

      return resolve(decoratedTracks)
    })
  })

export default DecorateTracklist
