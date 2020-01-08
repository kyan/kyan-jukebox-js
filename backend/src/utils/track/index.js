import Track from 'services/mongodb/models/track'
import Image from 'services/mongodb/models/image'
import logger from 'config/winston'

export function findTracks (uris) {
  return new Promise((resolve, reject) => {
    Track.find({ _id: { $in: uris } })
      .then(tracks => {
        logger.info('FOUND CACHED TRACKS', { keys: uris })
        return resolve(tracks)
      })
      .catch(err => reject(err))
  })
}

export function findImages (uris) {
  return new Promise((resolve, reject) => {
    Image.find({ uri: { $in: uris } })
      .then(images => {
        logger.info('FOUND CACHED IMAGES', { keys: uris })
        return resolve(images)
      })
      .catch(err => reject(err))
  })
}

export function addTracks (uris, user) {
  return new Promise((resolve) => {
    const brh = {
      fullname: 'BRH',
      picture: 'https://cdn-images-1.medium.com/fit/c/200/200/1*bFBXYvskkPFI9nPx6Elwxg.png'
    }

    const requests = uris.map((uri) => (
      Track.updateOne(
        { _id: uri },
        { $push: { addedBy: { ...(user || brh), addedAt: new Date() } } },
        { upsert: true } // Create a new Track if it doesn't exist
      ).exec()
    ))

    Promise.all(requests)
      .then(() => resolve(uris))
      .catch((error) => logger.error('addTracks', { message: error.message }))
  })
}

export default { findTracks, findImages, addTracks }
