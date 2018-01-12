import Transformer from '../transformer';

const payloadToJson = (key, data) => {
  return JSON.stringify({
    key: key,
    data: data
  });
}

class Broadcaster {
  constructor(wss_broadcast) {
    this.wss_broadcast = wss_broadcast;
  }

  to(client, key, message) {
    const unified_message = Transformer(key, message);
    console.log('[client] Key: %s', key);

    const payload = payloadToJson(key, unified_message);
    client.send(payload);
  }

  everyone(key, message) {
    const unified_message = Transformer(key, message);
    console.log('[all] Key: %s', key);

    const payload = payloadToJson(key, unified_message);
    this.wss_broadcast(payload);
  }

  // Mopidy Core Events we're interested in
  get eventList() {
    return [
      'event:trackPlaybackStarted',
      'event:playbackStateChanged',
      'event:trackPlaybackResumed',
      'event:tracklistChanged',
      'event:volumeChanged'
    ];
  }
}

export default Broadcaster;
