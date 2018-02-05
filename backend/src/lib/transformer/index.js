import TransformTrack from '../transformers/mopidy/track'
import TransformTracklist from '../transformers/mopidy/tracklist'

export default function (key, data) {
  switch (key) {
    case 'mopidy::playback.getCurrentTrack':
      return TransformTrack(data)
    case 'mopidy::tracklist.getTracks':
      return TransformTracklist(data)
    case 'mopidy::event:trackPlaybackStarted':
      return TransformTrack(data.tl_track.track)
    case 'mopidy::event:volumeChanged':
      return data.volume
    case 'mopidy::playback.getTimePosition':
    case 'mopidy::event:tracklistChanged':
    case 'mopidy::library.getImages':
    case 'mopidy::tracklist.add':
    case 'mopidy::tracklist.clear':
    case 'mopidy::mixer.getVolume':
    case 'mopidy::mixer.setVolume':
    case 'mopidy::playback.next':
      return data
    default:
      return `BACKEND RESPONSE NOT HANDLED: ${key}`
  }
};
