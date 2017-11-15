import Transformer from '../transformer';

class Broadcaster {
  constructor(wss_broadcast) {
    this.wss_broadcast = wss_broadcast;
  }

  all(key, message) {
    const unified_message = Transformer(key, message);
    console.log('Key: %s', key);
    console.log('Payload: ', unified_message);

    if (unified_message) {
      this.wss_broadcast(JSON.stringify({
        key: key,
        data: unified_message
      }));
    }
  }

  // Mopidy Core Events we're interested in
  get eventList() {
    return [
      'event:trackPlaybackStarted',
      'event:trackPlaybackEnded',
      'event:playbackStateChanged',
      'event:playlistChanged',
      'event:volumeChanged'
    ];

  }
}

export default Broadcaster;
