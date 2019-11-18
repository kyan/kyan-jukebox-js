export default {
  PLAYBACK_GET_CURRENT_TRACK: 'mopidy::playback.getCurrentTrack',
  EVENT_TRACK_PLAYBACK_STARTED: 'mopidy::event:trackPlaybackStarted',
  EVENT_PLAYBACK_STATE_CHANGED: 'mopidy::event:playbackStateChanged',
  EVENT_PLAYBACK_STATE_RESUMED: 'mopidy::event:trackPlaybackResumed',
  TRACKLIST_GET_TRACKS: 'mopidy::tracklist.getTracks',
  TRACKLIST_ADD_TRACK: 'mopidy::tracklist.add',
  TRACKLIST_REMOVE_TRACK: 'mopidy::tracklist.remove',
  TRACKLIST_CLEAR: 'mopidy::tracklist.clear',
  LIBRARY_GET_IMAGES: 'mopidy::library.getImages',
  PLAYBACK_GET_TIME_POSITION: 'mopidy::playback.getTimePosition',
  PLAYBACK_GET_PLAYBACK_STATE: 'mopidy::playback.getState',
  PLAYBACK_PLAY: 'mopidy::playback.play',
  PLAYBACK_STOP: 'mopidy::playback.stop',
  PLAYBACK_PAUSE: 'mopidy::playback.pause',
  PLAYBACK_NEXT: 'mopidy::playback.next',
  PLAYBACK_BACK: 'mopidy::playback.previous',
  PLAYING: 'playing',
  PAUSED: 'paused',
  STOPPED: 'stopped',
  SET_VOLUME: 'mopidy::mixer.setVolume',
  GET_VOLUME: 'mopidy::mixer.getVolume',
  EVENT_VOLUME_CHANGED: 'mopidy::event:volumeChanged'
}
