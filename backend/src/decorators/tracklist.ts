import DecorateTrack from './track'
import Mopidy from 'mopidy'
import ImageCache from '../utils/image-cache'
import { getDatabase } from '../services/database/factory'
import { MopidyTrackExt, JBTrack } from '../types/database'

const DecorateTracklist = (json: Mopidy.models.Track[]): Promise<JBTrack[]> =>
  new Promise((resolve) => {
    const uris: ReadonlyArray<string> = json.map((data) => data.uri)
    const db = getDatabase()
    const requests: [Promise<JBTrack[]>, Promise<any[]>] = [
      db.tracks.findByUris(Array.from(uris)),
      ImageCache.findAll(uris)
    ]

    Promise.all(requests).then((responses) => {
      const tracks: JBTrack[] = responses[0]
      const images: any[] = responses[1]
      const decoratedTracks = json.map((data) => {
        const track = data as MopidyTrackExt
        const trackData = tracks.find((t) => t.uri === track.uri)
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
