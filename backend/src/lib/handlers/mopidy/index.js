import StrToFunction from '../../str-to-function'
import EventLogger from '../../event_logger'
import ImageCache from './image-cache'

const sendToClient = (bcast, ws, payload, data) => {
  bcast.to(ws, payload, data)
}

const logEvent = (payload, data) => {
  EventLogger(payload.user_id, payload.encoded_key, data)
}

const MopidyHandler = (payload, ws, bcast, mopidy) => {
  const { key, data } = payload

  ImageCache.check(payload.encoded_key, data, (err, obj) => {
    if (err) { throw err }

    if (obj.image) {
      sendToClient(bcast, ws, payload, obj.image)
    } else {
      const apiCall = StrToFunction(mopidy, key)

      ;(data ? apiCall(data) : apiCall())
        .then(resp => {
          if (obj.addToCache) obj.addToCache(resp)
          logEvent(payload, resp)
          sendToClient(bcast, ws, payload, resp)
        })
        .catch(console.error.bind(console))
        .done()
    }
  })
}

export default MopidyHandler
