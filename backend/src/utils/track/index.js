import Track from 'services/mongodb/models/track'
import logger from 'config/winston'

export function findTracks (uris) {
  return new Promise((resolve, reject) => {
    Track.find({'_id': { $in: uris }})
      .then(track => resolve(track))
      .catch(err => reject(err))
  })
}

export function addTrack (uri, user) {
  Track.updateOne({ _id: uri },
    { $push: { addedBy: { ...user, addedAt: new Date() } } },
    { upsert: true }, // Create a new Track if it doesn't exist
    (err, track) => {
      if (err) { return }
      if (track) { logger.info('Updated track', track) }
    }
  )
}

export default { findTracks, addTrack }
