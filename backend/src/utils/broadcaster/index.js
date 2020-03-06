import logger from 'config/winston'
import MessageType from 'constants/message'
import EventLogger from 'utils/event-logger'
import Payload from 'utils/payload'

const Broadcaster = {
  toClient: ({ socket, headers, message, type = MessageType.GENERIC }) => {
    try {
      const payload = Payload.encodeToJson(headers.key, message, headers.user)
      const context = headers.user ? MessageType.OUTGOING_API_AUTH : MessageType.OUTGOING_API

      EventLogger.info(context, { key: headers.key, data: message })
      socket.emit(type, payload)
    } catch (e) {
      logger.error('Broadcaster#toClient', { message: e.message })
    }
  },

  toAll: ({ socketio, headers, message, type = MessageType.GENERIC }) => {
    try {
      const payload = Payload.encodeToJson(headers.key, message, headers.user)

      EventLogger.info(MessageType.OUTGOING_ALL, { key: headers.key, data: message })
      socketio.emit(type, payload)
    } catch (e) {
      logger.error('Broadcaster#toAll', { message: e.message })
    }
  },

  stateChange: ({ socket, message }) => {
    const payload = Payload.toJsonString(message)

    try {
      EventLogger.info(MessageType.OUTGOING_STATE_CHANGE, { key: 'state', data: message })
      socket.emit(MessageType.MOPIDY, payload)
    } catch (e) {
      logger.error('Broadcaster#stateChange', { message: e.message })
    }
  }
}

export default Broadcaster
