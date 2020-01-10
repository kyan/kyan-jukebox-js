import logger from 'config/winston'
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
  return Spotify.validateTrack(data.uri)
}

const logEvent = (headers, params, response, context) => {
  EventLogger({ encoded_key: headers.encoded_key }, params, response, context)
}

const MopidyHandler = (payload, ws, bcast, mopidy) => {
  const { key, data } = payload
  logEvent(payload, data, null, MessageType.INCOMING_CLIENT)

  isValidTrack(
    payload.encoded_key, data
  ).then(() => {
    const apiCall = StrToFunction(mopidy, key)
    logEvent(payload, data, null, MessageType.OUTGOING_MOPIDY)

    const successHandler = response => {
      logEvent(payload, data, response, MessageType.INCOMING_MOPIDY)
      bcast.to(ws, payload, response)
    }

    (data ? apiCall(data) : apiCall())
      .then(successHandler)
      .catch((err) => logger.error(`Mopidy API Failure: ${err.message}`))
  }).catch((err) => {
    payload.encoded_key = Mopidy.VALIDATION_ERROR
    bcast.to(ws, payload, err.message)
  })
}

export default MopidyHandler
