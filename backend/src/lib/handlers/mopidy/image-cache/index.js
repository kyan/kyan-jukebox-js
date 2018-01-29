import MemoryCache from 'memory-cache'

const cache = new MemoryCache.Cache()
const isImageKey = (key) => {
  return (key === 'mopidy::library.getImages')
}

const pruneCache = () => {
  const { MAX_IMG_CACHE_SIZE = 200 } = process.env
  if (cache.size() > MAX_IMG_CACHE_SIZE) cache.clear()
}

const addToCacheHandler = (key) => {
  pruneCache()

  const handler = (value) => {
    return cache.put(key, value)
  }
  return handler
}

const fetchFromCache = (key) => {
  return cache.get(key)
}

const ImageCache = {
  check: (key, data, callback) => {
    if (!isImageKey(key)) return callback(null, { image: false })
    const encodedKey = key + data[0][0]
    const image = fetchFromCache(encodedKey)

    if (image) {
      console.log('Using cached: ', encodedKey)
      return callback(null, { image })
    } else {
      return callback(null, { addToCache: addToCacheHandler(encodedKey) })
    }
  }
}

export default ImageCache
