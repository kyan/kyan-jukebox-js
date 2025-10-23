import DecorateTrack from './track'
import { getDatabase } from '../services/database/factory'
import { JBTrack, SpotifyTrackObjectFullExt } from '../types/database'

const DecorateSearchResults = async (
  spotifyTracks: SpotifyApi.TrackObjectFull[]
): Promise<JBTrack[]> => {
  const trackUris = spotifyTracks.map((track) => track.uri)
  const db = getDatabase()

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

  try {
    const tracks: JBTrack[] = await db.tracks.findByUris(trackUris)

    const decoratedTracks = spotifyTracks.map(
      (spotifyTrack: SpotifyTrackObjectFullExt) => {
        const trackData = tracks.find((track) => (track as any)._id === spotifyTrack.uri)

        if (trackData) {
          spotifyTrack.addedBy = trackData.addedBy
          spotifyTrack.metrics = trackData.metrics
        }

        const decorated = DecorateTrack(spotifyTrack as SpotifyTrackObjectFullExt)
        return decorated
      }
    )

    const sorted = decoratedTracks.sort(compare)
    return sorted
  } catch (error) {
    console.error('DecorateSearchResults error:', error)
    return []
  }
}

export default DecorateSearchResults
