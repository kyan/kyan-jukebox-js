import Track from '../models/track'
import { getTracklist } from '../models/setting'
import { ImageCacheInterface } from './image-cache'
import SpotifyService from '../services/spotify'

export interface SuitableDataInterface {
  images: ImageCacheInterface
  uris: ReadonlyArray<string>
}

const newTracksAddedLimit = process.env.SPOTIFY_NEW_TRACKS_ADDED_LIMIT

const Recommendations = {
  /**
   * Strip out images from Spotify track information
   *
   * @param tracks - A list of Spotify tracks
   */
  getImageFromSpotifyTracks: (
    tracks: SpotifyApi.TrackObjectFull[]
  ): ImageCacheInterface => {
    const albumTracks = tracks.filter((track) => track.album)
    const images = albumTracks.map((track) => {
      if (track.linked_from && track.linked_from.type === 'track') {
        return {
          [track.uri]: track.album.images[0].url,
          [track.linked_from.uri]: track.album.images[0].url
        }
      }

      return { [track.uri]: track.album.images[0].url }
    })
    return Object.assign({}, ...images)
  },

  /**
   * Attempts to extract suitable tracks from the tracks provided
   *
   * There are various filters. These include:
   *  - ~explicit tracks~
   *  - tracks already played today
   *  - tracks not in the current playlist
   *  - tracks that have an average vote of < 50 and at least one vote
   *
   *  Limited to SPOTIFY_NEW_TRACKS_ADDED_LIMIT
   *
   * @param tracks - A list of Spotify tracks
   */
  extractSuitableData: (
    tracks: SpotifyApi.TrackObjectFull[]
  ): Promise<SuitableDataInterface> =>
    new Promise((resolve) => {
      getTracklist().then(async (currentTrackListUris) => {
        const trackUris = tracks.map((t) => t.uri)
        const images = Recommendations.getImageFromSpotifyTracks(tracks)
        const currentTrackList = currentTrackListUris
        const urisToIgnore = await Track.find({
          _id: { $in: trackUris },
          'metrics.votesAverage': { $lt: 50 },
          'metrics.votes': { $gt: 0 }
        }).select('_id')
        const startOfToday = new Date()
        startOfToday.setHours(0, 0, 0, 0)
        const tracksPlayedToday = await Track.find({
          'addedBy.addedAt': { $gt: startOfToday }
        }).select('_id')
        const uris = tracks
          .filter((track) => !track.explicit)
          .filter((track_1) => !tracksPlayedToday.map((r) => r._id).includes(track_1.uri))
          .filter((track_2) => !currentTrackList.includes(track_2.uri))
          .filter((track_3) => !urisToIgnore.map((r) => r._id).includes(track_3.uri))
          .sort((a, b) => a.popularity - b.popularity)
          .slice(-newTracksAddedLimit)
          .map((track_4) => track_4.uri)

        resolve({ images, uris })
      })
    }),

  /**
   * If the data provided contains no tracks it will pick some at random:
   *
   * The criteria includes:
   *   - average vote is > 70
   *
   * Limited to SPOTIFY_NEW_TRACKS_ADDED_LIMIT
   *
   * @param data - An object of uris and images
   */
  enrichWithPopularTracksIfNeeded: (
    data: SuitableDataInterface
  ): Promise<SuitableDataInterface> => {
    if (data.uris.length > 0) return Promise.resolve(data)
    const images = data.images

    return new Promise((resolve) => {
      getTracklist().then(async (currentTrackListUris) => {
        const currentTrackList = currentTrackListUris
        const results = await Track.aggregate([
          { $match: { 'metrics.votesAverage': { $gte: 70 } } },
          { $sample: { size: newTracksAddedLimit } },
          { $project: { _id: 1 } }
        ])
        const uris = results
          .filter((result) => !currentTrackList.includes(result._id))
          .map((r) => r._id)
        await SpotifyService.getTracks(uris)

        resolve({ images, uris })
      })
    })
  }
}

export default Recommendations
