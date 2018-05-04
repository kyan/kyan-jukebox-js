import Transformer from '../transformer'
import Payload from '../payload'

class Broadcaster {
  constructor (wssBroadcast) {
    this.wssBroadcast = wssBroadcast
  }

  to (client, payload, message) {
    const encodedKey = payload.encoded_key
    const unifiedMessage = Transformer(encodedKey, message)
    const uid = payload.user_id ? payload.user_id : 'public'
    console.log(`[c][${uid}]: ${encodedKey}`)

    client.send(Payload.encodeToJson(encodedKey, unifiedMessage))
  }

  everyone (key, message) {
    const unifiedMessage = Transformer(key, message)
    console.log(`[a]: ${key}`)

    this.wssBroadcast(Payload.encodeToJson(key, unifiedMessage))
  }
}

export default Broadcaster
