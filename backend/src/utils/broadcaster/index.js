import logger from 'config/winston'
import MessageType from 'constants/message'
import EventLogger from 'utils/event-logger'
import Transform from 'utils/transformer'
import Payload from 'utils/payload'

const Broadcaster = {
  to: (client, headers, message, type) => {
    const key = headers.encoded_key
    Transform.message(key, message).then(unifiedMessage => {
      const context = headers.user ? MessageType.OUTGOING_API_AUTH : MessageType.OUTGOING_API
      try {
        const payload = Payload.encodeToJson(key, unifiedMessage, headers.user)
        EventLogger(headers, null, payload, context)
        client.emit(type || MessageType.GENERIC, payload)
      } catch (e) {
        logger.error('Broadcaster#to', { message: e.message })
      }
    })
  },

  toAllGeneric: (socket, key, message) => {
    const payload = Payload.encodeToJson(key, message)

    try {
      EventLogger(key, null, message, MessageType.OUTGOING_API_ALL)
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
