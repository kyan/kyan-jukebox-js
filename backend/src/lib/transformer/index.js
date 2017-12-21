import TransformTrack from '../transform-track';

export default function(key, data) {
  switch (key) {
    case 'playback.getCurrentTrack':
      return TransformTrack(data);
    case 'playback.getTimePosition':
      return data;
    case 'tracklist.getTracks':
      return data.map(track => {
        return TransformTrack(track)
      });
    case 'event:trackPlaybackStarted':
      return TransformTrack(data.tl_track.track);
    case 'event:tracklistChanged':
      return data;
    case 'event:volumeChanged':
      return data.volume;
    case 'library.getImages':
      return data;
    case 'tracklist.add':
      return data;
    case 'mixer.getVolume':
      return data;
    case 'mixer.setVolume':
      return data;
    case 'playback.next':
      return data;
    default:
      return `BACKEND RESPONSE NOT HANDLED: ${key}`;
  }
};
