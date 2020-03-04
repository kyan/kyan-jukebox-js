import logger from 'config/winston'
import Broadcaster from 'utils/broadcaster'
import Decorator from 'decorators/mopidy'
import EventLogger from 'utils/event-logger'
import MessageType from 'constants/message'
import Mopidy from 'constants/mopidy'
import Spotify from 'services/spotify'

const StrToFunction = (obj, methodStr) => {
  let context = obj

  methodStr.split('.').forEach(function (mthd) {
    context = context[mthd]
  })

  return context
}

const isValidTrack = (key, data) => {
  if (key !== Mopidy.TRACKLIST_ADD) return Promise.resolve()
  return Spotify.validateTrack(data.uris[0])
}

const MopidyHandler = (payload, socket, mopidy) => {
  const { key, data } = payload
  EventLogger.info(MessageType.INCOMING_CLIENT, payload)

  const broadcastTo = (headers, message) => {
    Decorator.parse(headers, message).then(unifiedMessage => {
      Broadcaster.toClient(socket, headers, unifiedMessage)
    })
  }

  isValidTrack(
    payload.key, data
  ).then(() => {
    const apiCall = StrToFunction(mopidy, key)
    EventLogger.info(MessageType.OUTGOING_MOPIDY, payload)

    const successHandler = response => {
      EventLogger.info(MessageType.INCOMING_MOPIDY, { ...payload, ...{ response } }, true)
      broadcastTo(payload, response)
    }

    (data ? apiCall(data) : apiCall())
      .then(successHandler)
      .catch((err) => logger.error(`Mopidy API Failure: ${err.message}`))
  }).catch((err) => {
    payload.key = Mopidy.VALIDATION_ERROR
    Broadcaster.toClient(socket, payload, err.message)
  })
}

export default MopidyHandler
