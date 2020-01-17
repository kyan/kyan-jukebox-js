import mongoose from 'mongoose'
import User from 'services/mongodb/models/user'
import logger from 'config/winston'

const trackSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.String,
  addedBy: [{
    _id: false,
    user: { type: mongoose.Schema.Types.String, ref: 'User' },
    addedAt: mongoose.Schema.Types.Date,
    playedAt: { type: mongoose.Schema.Types.Date, default: null }
  }]
}, { _id: false })
const Track = mongoose.model('Track', trackSchema)

const brh = {
  _id: '1ambigrainbowhead',
  fullname: 'BRH',
  picture: 'https://cdn-images-1.medium.com/fit/c/200/200/1*bFBXYvskkPFI9nPx6Elwxg.png'
}

const findTracks = (uris) => {
  return new Promise((resolve, reject) => {
    Track.find({ _id: { $in: uris } })
      .populate({ path: 'addedBy.user' })
      .then(tracks => {
        if (tracks.length > 0) logger.info('FOUND CACHED TRACKS', { keys: uris })
        return resolve(tracks)
      })
      .catch(err => reject(err))
  })
}

const findOrUseBRH = (user) => {
  if (user) return Promise.resolve(user)

  return User.findOneAndUpdate(
    { _id: brh._id },
    brh,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
}

const addTracks = (uris, user) => {
  return new Promise((resolve) => {
    findOrUseBRH(user).then((returnUser) => {
      const requests = uris.map((uri) => (
        Track.updateOne(
          { _id: uri },
          { $push: { addedBy: { user: returnUser, addedAt: new Date() } } },
          { upsert: true, runValidators: true } // Create a new Track if it doesn't exist
        ).exec()
      ))

      Promise.all(requests)
        .then(() => resolve(uris))
        .catch((error) => logger.error('addTracks:Track.updateOne', { message: error.message }))
    }).catch((error) => logger.error('addTracks:findOrUseBRH', { message: error.message }))
  })
}

const updateTrackPlaycount = (uri) => {
  return new Promise((resolve) => {
    Track.findById(uri)
      .then((track) => {
        if (track && track.addedBy[0]) {
          track.addedBy[0].playedAt = new Date()
          return track.save()
        }

        return Promise.resolve(track)
      })
      .then((track) => resolve(track))
      .catch((error) => logger.error('updateTrackPlaycount', { message: error.message }))
  })
}

export default Track
export { findTracks, addTracks, updateTrackPlaycount }
