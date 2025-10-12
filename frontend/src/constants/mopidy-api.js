const mopidyApi = {
  PLAYBACK_GET_CURRENT_TRACK: 'playback.getCurrentTrack',
  EVENT_TRACK_PLAYBACK_STARTED: 'event:trackPlaybackStarted',
  EVENT_PLAYBACK_STATE_CHANGED: 'event:playbackStateChanged',
  EVENT_PLAYBACK_STATE_RESUMED: 'event:trackPlaybackResumed',
  TRACKLIST_GET_TRACKS: 'tracklist.getTracks',
  TRACKLIST_ADD_TRACK: 'tracklist.add',
  TRACKLIST_REMOVE_TRACK: 'tracklist.remove',
  TRACKLIST_CLEAR: 'tracklist.clear',
  PLAYBACK_GET_TIME_POSITION: 'playback.getTimePosition',
  PLAYBACK_GET_PLAYBACK_STATE: 'playback.getState',
  PLAYBACK_PLAY: 'playback.play',
  PLAYBACK_STOP: 'playback.stop',
  PLAYBACK_PAUSE: 'playback.pause',
  PLAYBACK_NEXT: 'playback.next',
  PLAYBACK_BACK: 'playback.previous',
  PLAYING: 'playing',
  PAUSED: 'paused',
  STOPPED: 'stopped',
  SET_VOLUME: 'mixer.setVolume',
  GET_VOLUME: 'mixer.getVolume',
  EVENT_VOLUME_CHANGED: 'event:volumeChanged',
  VALIDATION_ERROR: 'validationError'
}

export default mopidyApi
