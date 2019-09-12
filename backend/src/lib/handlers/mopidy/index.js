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

const logEvent = (payload, data) => {
  EventLogger(payload.user_id, payload.encoded_key, data)
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

        const fetchData = resp => {
          if (resp) {
            if (obj.addToCache) obj.addToCache(resp)

            logEvent(payload, resp)
            sendToClient(bcast, ws, payload, resp)
          }
        }

        const failureHandler = () => {
          logger.error('failureHandler: ', { key: key })
        }

        (data ? apiCall(data) : apiCall()).then(fetchData, failureHandler)
      }
    })
  })
}

export default MopidyHandler
