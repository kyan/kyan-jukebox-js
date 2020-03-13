import Track from 'services/mongodb/models/track'
import { getTracklist } from 'services/mongodb/models/setting'
import SpotifyService from 'services/spotify'

const newTracksAddedLimit = process.env.SPOTIFY_NEW_TRACKS_ADDED_LIMIT

const Recommendations = {
  getImageFromSpotifyTracks: (tracks) => {
    const albumTracks = tracks.filter((track) => track.album)
    const images = albumTracks.map(track => {
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

  extractSuitableData: (tracks) => (
    new Promise((resolve) => {
      getTracklist()
        .then(currentTrackListUris => {
          const images = Recommendations.getImageFromSpotifyTracks(tracks)
          const currentTrackList = currentTrackListUris

          Track.find({
            _id: { $in: tracks.map(t => t.uri) },
            'metrics.votesAverage': { $lt: 50 },
            'metrics.votes': { $gt: 0 }
          }).select('_id').then(results => {
            const urisToIgnore = results.map(r => r._id)
            const uris = tracks
              .filter(track => !track.explicit)
              .filter(track => !currentTrackList.includes(track.uri))
              .filter(track => !urisToIgnore.includes(track.uri))
              .sort((a, b) => a.popularity - b.popularity)
              .slice(-newTracksAddedLimit)
              .map(track => track.uri)

            return resolve({ images, uris })
          })
        })
    })
  ),

  addRandomUris: (data) => {
    if (data.uris.length > 0) return Promise.resolve(data)
    const images = data.images

    return new Promise((resolve) => {
      getTracklist()
        .then(currentTrackListUris => {
          const currentTrackList = currentTrackListUris

          return Track.aggregate([
            { $match: { 'metrics.votesAverage': { $gte: 70 } } },
            { $sample: { size: 3 } },
            { $project: { _id: 1 } }
          ]).then(results => {
            const uris = results
              .filter(result => !currentTrackList.includes(result._id))
              .map(r => r._id)
            return SpotifyService.getTracks(uris).then(() => resolve({ images, uris }))
          })
        })
    })
  }
}

export default Recommendations
