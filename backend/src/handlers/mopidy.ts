import logger from '../config/logger'
import Broadcaster from '../utils/broadcaster'
import MopidyDecorator from '../decorators/mopidy'
import EventLogger from '../utils/event-logger'
import MessageType from '../constants/message'
import MopidyConstants from '../constants/mopidy'
import Spotify from '../services/spotify'
import Mopidy from 'mopidy'
import Payload from '../utils/payload'

interface MopidyHandler {
  payload: Payload
  socketio: SocketIO.Server
  socket: SocketIO.Socket
  mopidy: Mopidy
}

const StrToFunction = (mopidy: Mopidy, methodStr: string) => {
  let context: any = mopidy
  methodStr.split('.').forEach(function (mthd) {
    context = context[mthd]
  })
  return context
}

const isValidTrack = (key: string, data: any) => {
  if (key !== MopidyConstants.TRACKLIST_ADD) return Promise.resolve()
  return Spotify.validateTrack(data.uris[0])
}

const MopidyHandler = ({ payload, socketio, socket, mopidy }: MopidyHandler) => {
  const { key, data } = payload
  EventLogger.info(MessageType.INCOMING_CLIENT, payload)

  const broadcastTo = ({ headers, data }: { headers: any; data: any }) =>
    MopidyDecorator.parse(headers, data).then((response) => {
      if (response && response.toAll) {
        delete response.toAll
        return Broadcaster.toAll({ socketio, headers, message: response })
      }

      Broadcaster.toClient({ socket, headers, message: response })
    })

  isValidTrack(payload.key, data)
    .then(() => {
      EventLogger.info(MessageType.OUTGOING_MOPIDY, payload)

      const successHandler = (response: any) => {
        EventLogger.info(
          MessageType.INCOMING_MOPIDY,
          { ...payload, ...{ response } },
          true
        )
        broadcastTo({ headers: payload, data: response })
      }

      return (data ? StrToFunction(mopidy, key)(data) : StrToFunction(mopidy, key)())
        .then(successHandler)
        .catch((err: any) => logger.error(`Mopidy API Failure: ${err.message}`))
    })
    .catch((err) => {
      payload.key = MopidyConstants.VALIDATION_ERROR
      broadcastTo({ headers: payload, data: { message: err.message } })
    })
}

export default MopidyHandler
