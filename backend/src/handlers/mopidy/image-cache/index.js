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

const addToCacheHandler = (encodedKey) => {
  const handler = (data) => {
    const uri = encodedKey.split('#')[1]

    return Image.create({
      expireAt: expiresDate(data[uri]),
      uri: encodedKey,
      data
    })
  }
  return handler
}

const ImageCache = {
  check: (key, data) => new Promise((resolve) => {
    if (!isImageKey(key)) return resolve({ image: false })
    const encodedKey = `${key}#${data[0][0]}`

    fetchFromCache(encodedKey).then((response) => {
      if (response) {
        logger.info('Using cache', { key: encodedKey })
        return resolve({ image: response.data })
      } else {
        return resolve({ addToCache: addToCacheHandler(encodedKey) })
      }
    })
  })
}

export default ImageCache
