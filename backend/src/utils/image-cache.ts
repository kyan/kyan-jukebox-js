import EventLogger from '../utils/event-logger'
import Image, { DBImageInterface } from '../models/image'
import logger from '../config/logger'

// Expects an imageData structure like:
//   {
//     'spotify:track:10jsW2NYd9blCrDITMh2zS': 'https://i.scdn.co/image/ab67616d00001e02627434487365cb0af24ec15f',
//     'spotify:track:10jsW2NYd9blCrDITMh2zG': 'https://i.scdn.co/image/ab67616d00001e02627434487365cb0af24ec15d'
//   }
export interface ImageCacheInterface {
  [key: string]: string
}

const expiresDate = () => {
  const day = 12 * 3600 * 1000
  const today = new Date()
  return new Date(today.getTime() + (day * 30))
}

const storeImages = (imageData: ImageCacheInterface): Promise<any> => {
  if (!imageData) return Promise.resolve(imageData)
  const options = { upsert: true, new: true, setDefaultsOnInsert: true }

  return new Promise((resolve, reject) => {
    const requests: any = Object.keys(imageData).map((uri) => {
      const imageUri = imageData[uri]
      if (!imageUri) return reject(new Error('storeImages: Bad data'))

      return Image.findOneAndUpdate(
        { _id: uri },
        { url: imageUri, expireAt: expiresDate() },
        options
      ).exec()
    })

    Promise.all(requests)
      .then(responses => resolve(responses))
      .catch((error) => logger.error('storeImages:Image.findOneAndUpdate', { message: error.message }))
  })
}

const ImageCache = {
  findAll: (uris: ReadonlyArray<string>): Promise<DBImageInterface[]> => (
    new Promise((resolve, reject) => {
      Image.find({ _id: { $in: uris } })
        .then(images => {
          if (images.length > 0) EventLogger.info('FOUND CACHED IMAGES', { data: uris })
          return resolve(images)
        })
        .catch(err => reject(err))
    })
  ),

  addAll: (imageData: ImageCacheInterface): Promise<any> => storeImages(imageData)
}

export default ImageCache
