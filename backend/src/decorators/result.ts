import DecorateTrack from './track'
import {
  findTracks,
  JBTrackInterface,
  JBTrackPayloadInterface,
  DBTrackInterface
} from '../models/track'

const DecorateSearchResults = (
  json: JBTrackInterface[]
): Promise<JBTrackPayloadInterface[]> =>
  new Promise((resolve) => {
    const trackUris = json.map((data) => data.uri)
    const requests = [findTracks(trackUris)]

    const compare = (a: JBTrackPayloadInterface, b: JBTrackPayloadInterface): number => {
      let comparison = 0
      let votesA = a.track.metrics && a.track.metrics.votesAverage
      let votesB = b.track.metrics && b.track.metrics.votesAverage
      if (votesA === undefined) votesA = -1
      if (votesB === undefined) votesB = -1

      if (votesA < votesB) {
        comparison = 1
      } else if (votesA > votesB) {
        comparison = -1
      }

      return comparison
    }

    Promise.all<DBTrackInterface[]>(requests).then((responses) => {
      const tracks: DBTrackInterface[] = responses[0]
      const decoratedTracks = json.map((data) => {
        const trackData = tracks.find((track) => track._id === data.uri)

        if (trackData) {
          data.addedBy = trackData.addedBy
          data.metrics = trackData.metrics
        }

        return DecorateTrack(data)
      })

      resolve(decoratedTracks.sort(compare))
    })
  })

export default DecorateSearchResults
