import Transformer from '../transformer'
import Payload from '../payload'

class Broadcaster {
  constructor (wssBroadcast) {
    this.wssBroadcast = wssBroadcast
  }

  to (client, key, message) {
    const unifiedMessage = Transformer(key, message)
    console.log('[client] Key: %s', key)

    const payload = Payload.encodeToJson(key, unifiedMessage)
    client.send(payload)
  }

  everyone (key, message) {
    const unifiedMessage = Transformer(key, message)
    console.log('[all] Key: %s', key)

    const payload = Payload.encodeToJson(key, unifiedMessage)
    this.wssBroadcast(payload)
  }
}

export default Broadcaster
