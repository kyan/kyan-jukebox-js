import DecorateTrack from './track'
import { findTracks, JBTrackInterface } from '../models/track'

const DecorateSearchResults = (json: JBTrackInterface[]) => {
  return new Promise((resolve) => {
    const trackUris = json.map(data => data.uri)
    const requests = [
      findTracks(trackUris)
    ]

    const compare = (a: any, b: any): number => {
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

    Promise.all(requests).then((responses: any[]) => {
      const tracks: any[] = responses[0]
      const decoratedTracks = json.map(data => {
        const trackData = tracks.find(track => track._id === data.uri)

        if (trackData) {
          data.addedBy = trackData.addedBy
          data.metrics = trackData.metrics
        }

        return DecorateTrack(data)
      })

      return resolve(decoratedTracks.sort(compare))
    })
  })
}

export default DecorateSearchResults
