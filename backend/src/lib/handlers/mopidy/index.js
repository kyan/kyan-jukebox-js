import StrToFunction from '../../str-to-function'
import Payload from '../../payload'
import ImageCache from './image-cache'

const sendToClient = (bcast, ws, key, data) => {
  bcast.to(ws, key, data)
}

const MopidyHandler = (payload, ws, bcast, mopidy) => {
  const { service, key, data } = Payload.decode(payload)
  const encodedKey = Payload.encodeKey(service, key)

  ImageCache.check(encodedKey, data, (err, obj) => {
    if (err) { throw err }

    if (obj.image) {
      sendToClient(bcast, ws, encodedKey, obj.image)
    } else {
      const apiCall = StrToFunction(mopidy, key)

      ;(data ? apiCall(data) : apiCall())
        .then(resp => {
          if (obj.addToCache) obj.addToCache(resp)
          sendToClient(bcast, ws, encodedKey, resp)
        })
        .catch(console.error.bind(console))
        .done()
    }
  })
}

export default MopidyHandler
