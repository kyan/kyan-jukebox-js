import logger from 'config/winston'
import EventLogger from '../event-logger'
import Transformer from '../transformer'
import Payload from '../payload'

const Broadcaster = {
  to: (client, payload, message) => {
    const encodedKey = payload.encoded_key
    const unifiedMessage = Transformer(encodedKey, message)
    const context = payload.user ? 'UserBroadcast' : 'PublicBroadcast'
    EventLogger(payload, null, unifiedMessage, context)

    try {
      client.emit('message', Payload.encodeToJson(encodedKey, unifiedMessage))
    } catch (e) {
      logger.error('Broadcast_to#', { message: e.message })
    }
  }
}

export default Broadcaster
