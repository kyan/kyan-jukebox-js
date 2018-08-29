import logger from '../../../../config/winston'
import Image from '../../../services/mongodb/models/image'
import MopidyConsts from '../../../constants/mopidy'

const isImageKey = (key) => {
  return (key === MopidyConsts.LIBRARY_GET_IMAGES)
}

const expiresDate = (imgs) => {
  const hour = 3600 * 1000
  const day = 12 * 3600 * 1000
  const today = new Date()
  if (imgs.length < 1) { return new Date(today.getTime() + hour) }
  return new Date(today.getTime() + day)
}

const addToCacheHandler = (encodedKey) => {
  const handler = (data) => {
    const uri = encodedKey.split('#')[1]

    Image
      .create({
        expireAt: expiresDate(data[uri]),
        uri: encodedKey,
        data
      })

    return uri
  }
  return handler
}

const fetchFromCache = (key, responseHandler) => {
  return Image.findOne({ 'uri': key })
    .then(resp => responseHandler(resp))
}

const ImageCache = {
  check: (key, data, fn) => {
    if (!isImageKey(key)) return fn(null, { image: false })
    const encodedKey = `${key}#${data[0][0]}`

    fetchFromCache(encodedKey, (respo) => {
      if (respo) {
        logger.info('Using cache', { key: encodedKey })
        return fn(null, { image: respo.data })
      } else {
        return fn(null, { addToCache: addToCacheHandler(encodedKey) })
      }
    })
  }
}

export default ImageCache
