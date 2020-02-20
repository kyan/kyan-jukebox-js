import { sampleSize } from 'lodash'
import SettingsConsts from 'constants/settings'
import settings from 'utils/local-storage'
import Track from 'services/mongodb/models/track'

const newTracksAddedLimit = process.env.SPOTIFY_NEW_TRACKS_ADDED_LIMIT

const Recommendations = {
  getImageFromSpotifyTracks: (tracks) => {
    const albumTracks = tracks.filter((track) => track.album)
    const images = albumTracks.map(track => ({ [track.album.uri]: track.album.images[0].url }))
    return Object.assign({}, ...images)
  },

  extractSuitableData: (tracks) => {
    return new Promise((resolve) => {
      const currentTrackList = settings.getItem(SettingsConsts.TRACKLIST_CURRENT)
      const images = Recommendations.getImageFromSpotifyTracks(tracks)

      Track.find({
        _id: { $in: tracks.map(t => t.uri) },
        'metrics.votesAverage': { $lt: 20 },
        'metrics.votes': { $gt: 0 }
      }).select('_id').then(results => {
        const urisToIgnore = results.map(r => r._id)
        const uris = sampleSize(
          tracks
            .filter(track => !track.explicit)
            .filter(track => !currentTrackList.includes(track.uri))
            .filter(track => !urisToIgnore.includes(track.uri))
            .map(track => track.uri),
          newTracksAddedLimit
        )

        resolve({ images, uris })
      })
    })
  },

  addRandomUris: (data) => {
    if (data.uris.length > 0) return Promise.resolve(data)

    return new Promise((resolve) => {
      const currentTrackList = settings.getItem(SettingsConsts.TRACKLIST_CURRENT)

      Track.aggregate([
        { $match: { 'metrics.votesAverage': { $gte: 70 } } },
        { $sample: { size: 3 } },
        { $project: { _id: 1 } }
      ]).then(results => {
        const uris = results
          .filter(result => !currentTrackList.includes(result._id))
          .map(r => r._id)

        resolve({ ...data, uris })
      })
    })
  }
}

export default Recommendations
