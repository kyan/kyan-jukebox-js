export default {
  CONNECTION_ERROR: 'mopidy::connectionError',
  CORE_EVENTS: {
    PLAYBACK_STARTED: 'mopidy::event:trackPlaybackStarted',
    PLAYBACK_STATE_CHANGED: 'mopidy::event:playbackStateChanged',
    PLAYBACK_RESUMED: 'mopidy::event:trackPlaybackResumed',
    TRACKLIST_CHANGED: 'mopidy::event:tracklistChanged',
    VOLUME_CHANGED: 'mopidy::event:volumeChanged'
  },
  GET_CURRENT_TRACK: 'mopidy::playback.getCurrentTrack',
  GET_TRACKS: 'mopidy::tracklist.getTracks',
  LIBRARY_GET_IMAGES: 'mopidy::library.getImages',
  MIXER_GET_VOLUME: 'mopidy::mixer.getVolume',
  MIXER_SET_VOLUME: 'mopidy::mixer.setVolume',
  PLAYBACK_GET_STATE: 'mopidy::playback.getState',
  PLAYBACK_GET_TIME_POSITION: 'mopidy::playback.getTimePosition',
  PLAYBACK_NEXT: 'mopidy::playback.next',
  PLAYBACK_PREVIOUS: 'mopidy::playback.previous',
  TRACKLIST_ADD: 'mopidy::tracklist.add',
  TRACKLIST_CLEAR: 'mopidy::tracklist.clear',
  TRACKLIST_REMOVE: 'mopidy::tracklist.remove',
  AUTHORISED_KEYS: [
    'mopidy::tracklist.add',
    'mopidy::tracklist.remove',
    'mopidy::tracklist.clear',
    'mopidy::playback.play',
    'mopidy::playback.stop',
    'mopidy::playback.next',
    'mopidy::playback.previous',
    'mopidy::mixer.setVolume'
  ]
}
