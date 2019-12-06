import logger from 'config/winston'
import MessageType from 'constants/message'
import EventLogger from 'utils/event-logger'
import Transform from 'utils/transformer'
import Payload from 'utils/payload'

const Broadcaster = {
  to: (client, payload, message) => {
    const encodedKey = payload.encoded_key
    const unifiedMessage = Transform.message(encodedKey, message)
    const context = payload.user ? MessageType.OUTGOING_API_AUTH : MessageType.OUTGOING_API
    EventLogger(payload, null, unifiedMessage, context)

    try {
      client.emit(MessageType.GENERIC, Payload.encodeToJson(encodedKey, unifiedMessage))
    } catch (e) {
      logger.error('Broadcaster#to', { message: e.message })
    }
  },

  toAllGeneric: (socket, key, message) => {
    const payload = Payload.encodeToJson(key, message)

    try {
      EventLogger(payload, null, message, MessageType.OUTGOING_API_ALL)
      socket.emit(MessageType.GENERIC, payload)
    } catch (e) {
      logger.error('Broadcaster#toAll', { message: e.message })
    }
  },

  toAllMopidy: (socket, message) => {
    const payload = Payload.toJsonString(message)

    try {
      EventLogger({ encoded_key: 'state' }, null, payload, MessageType.OUTGOING_API_ALL)
      socket.emit(MessageType.MOPIDY, payload)
    } catch (e) {
      logger.error('Broadcaster#toAll', { message: e.message })
    }
  }
}

export default Broadcaster
