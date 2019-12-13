import Track from 'services/mongodb/models/track'

export function findTrack (uri) {
  return new Promise((resolve, reject) => {
    Track.findOne({ trackUri: uri })
      .then(track => resolve(track))
      .catch(err => reject(err))
  })
}

export function addTrack (uri, user) {
  Track.updateOne({ trackUri: uri },
    { $push: { users: { ...user, added_at: new Date() } } },
    { upsert: true }, // Create a new Track if it doesn't exist
    (err, track) => {
      if (err) return
      if (track) {
        console.log(track)
      }
    }
  )
}

export default { findTrack, addTrack }
