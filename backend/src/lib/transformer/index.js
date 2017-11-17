import TransformTrack from '../transform-track';

export default function(key, data) {
  if (key === 'playback.getCurrentTrack') {
    return TransformTrack(data);
  }

  if (key === 'playback.getTimePosition') {
    return data;
  }

  if (key === 'tracklist.getTracks') {
    return data.map(track => {
      return TransformTrack(track)
    });
  }

  if (key === 'event:trackPlaybackStarted') {
    return TransformTrack(data.tl_track.track);
  }

  if (key === 'event:tracklistChanged') {
    return data;
  }

  if (key === 'library.getImages') {
    return data;
  }

  return `NOT IMPLIMENTED: ${key}`;
};
