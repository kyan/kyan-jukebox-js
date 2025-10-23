import EventLogger from '../utils/event-logger'
import { getDatabase } from '../services/database/factory'
import logger from '../config/logger'

// Expects an imageData structure like:
//   {
//     'spotify:track:10jsW2NYd9blCrDITMh2zS': 'https://i.scdn.co/image/ab67616d00001e02627434487365cb0af24ec15f',
//     'spotify:track:10jsW2NYd9blCrDITMh2zG': 'https://i.scdn.co/image/ab67616d00001e02627434487365cb0af24ec15d'
//   }
export interface ImageCacheData {
  [key: string]: string
}

const storeImages = async (imageData: ImageCacheData): Promise<any> => {
  if (!imageData) return Promise.resolve(imageData)

  try {
    const db = getDatabase()
    await db.images.storeMany(imageData)
    return imageData
  } catch (error) {
    logger.error('storeImages:Image.storeMany', { message: error.message })
    throw error
  }
}

const ImageCache = {
  /**
   * Lookup images in database
   *
   * @param uris - A list of Track uris
   */
  findAll: async (uris: ReadonlyArray<string>): Promise<any[]> => {
    try {
      const db = getDatabase()
      const images = await db.images.findByUris(Array.from(uris))
      if (images.length > 0) EventLogger.info('FOUND CACHED IMAGES', { data: uris })
      return images
    } catch (error) {
      logger.error('ImageCache.findAll', { message: error.message })
      throw error
    }
  },

  addAll: (imageData: ImageCacheData): Promise<any> => storeImages(imageData)
}

export default ImageCache
