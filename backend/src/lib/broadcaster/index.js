import WebSocket from 'ws'
import logger from '../../config/winston'
import Transformer from '../transformer'
import Payload from '../payload'

class Broadcaster {
  constructor (clients) {
    this.clients = clients
  }

  to (client, payload, message) {
    const encodedKey = payload.encoded_key
    const unifiedMessage = Transformer(encodedKey, message)
    const uid = payload.user_id ? payload.user_id : 'public'
    logger.info('Client', { client: client.id, uid, encodedKey })

    try {
      client.send(Payload.encodeToJson(encodedKey, unifiedMessage))
    } catch (e) {
      logger.error('Broadcast_to#', { message: e.message })
    }
  }

  everyone (key, message) {
    const unifiedMessage = Transformer(key, message)
    logger.info('Everyone', { clients: this.clients.size, key })

    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(Payload.encodeToJson(key, unifiedMessage))
        } catch (e) {
          logger.error('Broadcast_everyone#', { message: e.message })
        }
      }
    })
  }
}

export default Broadcaster
