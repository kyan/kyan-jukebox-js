import Track from 'services/mongodb/models/track'
import logger from 'config/winston'

export function findTracks (uris) {
  return new Promise((resolve, reject) => {
    Track.find({'_id': { $in: uris }})
      .then(tracks => resolve(tracks))
      .catch(err => reject(err))
  })
}

export function addTrack (uri, user) {
  const brh = {
    fullname: 'BRH',
    picture: 'https://cdn-images-1.medium.com/fit/c/200/200/1*bFBXYvskkPFI9nPx6Elwxg.png'
  }

  Track.updateOne({ _id: uri },
    { $push: { addedBy: { ...(user || brh), addedAt: new Date() } } },
    { upsert: true }, // Create a new Track if it doesn't exist
    (err, track) => {
      if (err) { logger.error('Updated track', { message: err.message }) }
      if (track) { logger.info('Updated track', track) }
    }
  )
}

export default { findTracks, addTrack }
