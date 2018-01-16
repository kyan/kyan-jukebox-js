import Transformer from '../transformer'

const payloadToJson = (key, data) => {
  return JSON.stringify({
    key: key,
    data: data
  })
}

class Broadcaster {
  constructor (wssBroadcast) {
    this.wssBroadcast = wssBroadcast
  }

  to (client, key, message) {
    const unifiedMessage = Transformer(key, message)
    console.log('[client] Key: %s', key)

    const payload = payloadToJson(key, unifiedMessage)
    client.send(payload)
  }

  everyone (key, message) {
    const unifiedMessage = Transformer(key, message)
    console.log('[all] Key: %s', key)

    const payload = payloadToJson(key, unifiedMessage)
    this.wssBroadcast(payload)
  }

  // Mopidy Core Events we're interested in
  get eventList () {
    return [
      'event:trackPlaybackStarted',
      'event:playbackStateChanged',
      'event:trackPlaybackResumed',
      'event:tracklistChanged',
      'event:volumeChanged'
    ]
  }
}

export default Broadcaster
