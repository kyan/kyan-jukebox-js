import logger from 'config/winston'
import EventLogger from 'utils/event-logger'
import Transform from 'utils/transformer'
import Payload from 'utils/payload'

const Broadcaster = {
  to: (client, payload, message) => {
    const encodedKey = payload.encoded_key
    const unifiedMessage = Transform.message(encodedKey, message)
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
