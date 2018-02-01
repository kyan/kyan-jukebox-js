import TransformTrack from '../transformers/mopidy/track'
import TransformTracklist from '../transformers/mopidy/tracklist'

export default function (key, data) {
  switch (key) {
    case 'mopidy::playback.getCurrentTrack':
      return TransformTrack(data)
    case 'mopidy::playback.getTimePosition':
      return data
    case 'mopidy::tracklist.getTracks':
      return TransformTracklist(data)
    case 'mopidy::event:trackPlaybackStarted':
      return TransformTrack(data.tl_track.track)
    case 'mopidy::event:tracklistChanged':
      return data
    case 'mopidy::event:volumeChanged':
      return data.volume
    case 'mopidy::library.getImages':
      return data
    case 'mopidy::tracklist.add':
      return data
    case 'mopidy::mixer.getVolume':
      return data
    case 'mopidy::mixer.setVolume':
      return data
    case 'mopidy::playback.next':
      return data
    default:
      return `BACKEND RESPONSE NOT HANDLED: ${key}`
  }
};
