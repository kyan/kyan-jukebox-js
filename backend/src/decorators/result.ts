import DecorateTrack from './track'
import { getDatabase } from '../services/database/factory'
import { JBTrack, SpotifyTrackObjectFullExt } from '../types/database'

const DecorateSearchResults = (
  spotifyTracks: SpotifyApi.TrackObjectFull[]
): Promise<JBTrack[]> =>
  new Promise((resolve) => {
    const trackUris = spotifyTracks.map((track) => track.uri)
    const db = getDatabase()
    const requests = [db.tracks.findByUris(trackUris)]

    const compare = (a: JBTrack, b: JBTrack): number => {
      let comparison = 0
      let votesA = a.metrics && a.metrics.votesAverage
      let votesB = b.metrics && b.metrics.votesAverage
      if (votesA === undefined) votesA = -1
      if (votesB === undefined) votesB = -1

      if (votesA < votesB) {
        comparison = 1
      } else if (votesA > votesB) {
        comparison = -1
      }

      return comparison
    }

    Promise.all<JBTrack[]>(requests).then((responses) => {
      const tracks: JBTrack[] = responses[0]
      const decoratedTracks = spotifyTracks.map(
        (spotifyTrack: SpotifyTrackObjectFullExt) => {
          const trackData = tracks.find(
            (track) => (track as any)._id === spotifyTrack.uri
          )

          if (trackData) {
            spotifyTrack.addedBy = trackData.addedBy
            spotifyTrack.metrics = trackData.metrics
          }

          return DecorateTrack(spotifyTrack as SpotifyTrackObjectFullExt)
        }
      )

      resolve(decoratedTracks.sort(compare))
    })
  })

export default DecorateSearchResults
