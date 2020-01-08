import logger from 'config/winston'
import Image from 'services/mongodb/models/image'
import MopidyConsts from 'constants/mopidy'

const isImageKey = key => key === MopidyConsts.LIBRARY_GET_IMAGES
const fetchFromCache = key => Image.findOne({ 'uri': key })

const expiresDate = (imgs) => {
  const hour = 3600 * 1000
  const day = 12 * 3600 * 1000
  const today = new Date()
  if (imgs.length < 1) { return new Date(today.getTime() + hour) }
  return new Date(today.getTime() + (day * 30))
}

const storeImage = (uri, data) => Image.create({ expireAt: expiresDate(data[uri]), uri, data })
const addToCacheHandler = (uri) => (data) => storeImage(uri, data)

const ImageCache = {
  check: (key, data) => new Promise((resolve) => {
    if (!isImageKey(key)) return resolve({ image: false })
    const uri = data[0][0]

    fetchFromCache(uri).then((response) => {
      if (response) {
        logger.info('FOUND CACHED IMAGE', { key: uri })
        return resolve({ image: response.data })
      } else {
        return resolve({ addToCache: addToCacheHandler(uri) })
      }
    })
  })
}

export default ImageCache
