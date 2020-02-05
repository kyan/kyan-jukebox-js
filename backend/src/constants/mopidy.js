export default {
  CORE_EVENTS: {
    PLAYBACK_STARTED: 'event:trackPlaybackStarted',
    PLAYBACK_STATE_CHANGED: 'event:playbackStateChanged',
    PLAYBACK_RESUMED: 'event:trackPlaybackResumed',
    TRACKLIST_CHANGED: 'event:tracklistChanged',
    VOLUME_CHANGED: 'event:volumeChanged'
  },
  GET_CURRENT_TRACK: 'playback.getCurrentTrack',
  GET_TRACKS: 'tracklist.getTracks',
  MIXER_GET_VOLUME: 'mixer.getVolume',
  MIXER_SET_VOLUME: 'mixer.setVolume',
  PLAYBACK_GET_STATE: 'playback.getState',
  PLAYBACK_GET_TIME_POSITION: 'playback.getTimePosition',
  PLAYBACK_NEXT: 'playback.next',
  PLAYBACK_PREVIOUS: 'playback.previous',
  TRACKLIST_ADD: 'tracklist.add',
  TRACKLIST_CLEAR: 'tracklist.clear',
  TRACKLIST_REMOVE: 'tracklist.remove',
  VALIDATION_ERROR: 'validationError',
  AUTHORISED_KEYS: [
    'tracklist.add',
    'tracklist.remove',
    'tracklist.clear',
    'playback.play',
    'playback.pause',
    'playback.stop',
    'playback.next',
    'playback.previous',
    'mixer.setVolume',
    'castVote',
    'searchGetTracks'
  ]
}
