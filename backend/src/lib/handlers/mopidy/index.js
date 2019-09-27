import logger from '../../../config/winston'
import StrToFunction from '../../str-to-function'
import EventLogger from '../../event-logger'
import ImageCache from './image-cache'
import Mopidy from '../../constants/mopidy'
import Spotify from '../../services/spotify'

const isValidTrack = (key, data, callback) => {
  if (key !== Mopidy.TRACKLIST_ADD) return callback()
  Spotify.validateTrack(data.uri, callback)
}

const sendToClient = (bcast, ws, payload, data) => {
  bcast.to(ws, payload, data)
}

const logEvent = (headers, params, response) => {
  EventLogger({ encoded_key: headers.encoded_key }, params, response, 'APIRequest')
}

const MopidyHandler = (payload, ws, bcast, mopidy) => {
  const { key, data } = payload

  isValidTrack(payload.encoded_key, data, () => {
    ImageCache.check(payload.encoded_key, data, (err, obj) => {
      if (err) { throw err }

      if (obj.image) {
        sendToClient(bcast, ws, payload, obj.image)
      } else {
        const apiCall = StrToFunction(mopidy, key)

        const successHandler = response => {
          if (response) {
            if (obj.addToCache) obj.addToCache(response)
            sendToClient(bcast, ws, payload, response)
          }

          logEvent(payload, data, response)
        }

        const failureHandler = () => {
          logger.error('failureHandler: ', { key: key })
        }

        (data ? apiCall(data) : apiCall()).then(successHandler, failureHandler)
      }
    })
  })
}

export default MopidyHandler
