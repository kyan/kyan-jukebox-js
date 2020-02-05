import logger from 'config/winston'
import MessageType from 'constants/message'
import EventLogger from 'utils/event-logger'
import Payload from 'utils/payload'

const Broadcaster = {
  toClient: (client, headers, message, type) => {
    const key = headers.key
    const context = headers.user ? MessageType.OUTGOING_API_AUTH : MessageType.OUTGOING_API
    try {
      const payload = Payload.encodeToJson(key, message, headers.user)
      EventLogger.info(context, { key, data: message })
      client.emit(type || MessageType.GENERIC, payload)
    } catch (e) {
      logger.error('Broadcaster#toClient', { message: e.message })
    }
  },

  toAll: (socket, key, message, type) => {
    const payload = Payload.encodeToJson(key, message)

    try {
      EventLogger.info(type || MessageType.OUTGOING_API_ALL, { key, data: message })
      socket.emit(type || MessageType.GENERIC, payload)
    } catch (e) {
      logger.error('Broadcaster#toAll', { message: e.message })
    }
  },

  stateChange: (socket, message) => {
    const payload = Payload.toJsonString(message)

    try {
      EventLogger.info(MessageType.OUTGOING_STATE_CHANGE, { key: 'state', data: message })
      socket.emit(MessageType.MOPIDY, payload)
    } catch (e) {
      logger.error('Broadcaster#toAllMopidy', { message: e.message })
    }
  }
}

export default Broadcaster
