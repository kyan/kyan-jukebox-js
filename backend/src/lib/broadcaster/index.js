import logger from '../../config/winston'
import Transformer from '../transformer'
import Payload from '../payload'

const Broadcaster = {
  to: (client, payload, message) => {
    const encodedKey = payload.encoded_key
    const unifiedMessage = Transformer(encodedKey, message)
    const uid = payload.user_id ? payload.user_id : 'public'
    logger.info('Client', { client: client.id, uid, encodedKey })

    try {
      client.emit('message', Payload.encodeToJson(encodedKey, unifiedMessage))
    } catch (e) {
      logger.error('Broadcast_to#', { message: e.message })
    }
  }
}

export default Broadcaster
