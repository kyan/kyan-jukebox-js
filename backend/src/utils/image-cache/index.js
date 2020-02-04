import EventLogger from 'utils/event-logger'
import Image from 'services/mongodb/models/image'

const expiresDate = () => {
  const day = 12 * 3600 * 1000
  const today = new Date()
  return new Date(today.getTime() + (day * 30))
}

// Expects an imageData structure like:
//   {
//     'spotify:album:10jsW2NYd9blCrDITMh2zS': 'https://i.scdn.co/image/ab67616d00001e02627434487365cb0af24ec15f',
//     'spotify:album:10jsW2NYd9blCrDITMh2zG': 'https://i.scdn.co/image/ab67616d00001e02627434487365cb0af24ec15d'
//   }
const storeImages = (imageData) => {
  if (!imageData) return Promise.resolve(imageData)
  const options = { upsert: true, new: true, setDefaultsOnInsert: true }

  return new Promise((resolve, reject) => {
    const requests = Object.keys(imageData).map((uri) => {
      if (!imageData[uri]) return reject(new Error('storeImages: Bad data'))

      return Image.findOneAndUpdate(
        { _id: uri },
        { url: imageData[uri], expireAt: expiresDate(imageData[uri]) },
        options
      ).exec()
    })

    Promise.all(requests).then(response => resolve(response))
  })
}

const ImageCache = {
  findAll: (uris) => {
    return new Promise((resolve, reject) => {
      Image.find({ _id: { $in: uris } })
        .then(images => {
          if (images.length > 0) EventLogger.info('FOUND CACHED IMAGES', { data: uris })
          return resolve(images)
        })
        .catch(err => reject(err))
    })
  },

  addAll: (imageData) => storeImages(imageData)
}

export default ImageCache
