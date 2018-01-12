import Transformer from './index';
import TransformTrack from '../transform-track';
jest.mock('../transform-track');

describe('Transformer', () => {
  describe('playback.getCurrentTrack', () => {
    const data = 'data';

    it('does the right thing', () => {
      Transformer('playback.getCurrentTrack', data);
      expect(TransformTrack).toHaveBeenCalledWith(data);
    });
  });

  describe('playback.getTimePosition', () => {
    const data = 'data';

    it('does the right thing', () => {
      expect(Transformer('playback.getTimePosition', data)).toEqual(data);
    });
  });

  describe('tracklist.getTracks', () => {
    const data = 'data';

    it('does the right thing', () => {
      Transformer('tracklist.getTracks', [data]);
      expect(TransformTrack).toHaveBeenCalledWith(data);
    });
  });

  describe('event:trackPlaybackStarted', () => {
    const data = { tl_track: { track: 'data' } };

    it('does the right thing', () => {
      Transformer('event:trackPlaybackStarted', data);
      expect(TransformTrack).toHaveBeenCalledWith(data.tl_track.track);
    });
  });

  describe('event:tracklistChanged', () => {
    const data = 'data';

    it('does the right thing', () => {
      expect(Transformer('event:tracklistChanged', data)).toEqual(data);
    });
  });

  describe('event:volumeChanged', () => {
    const data = { volume: 99 };

    it('does the right thing', () => {
      expect(Transformer('event:volumeChanged', data)).toEqual(data.volume);
    });
  });

  describe('library.getImages', () => {
    const data = 'data';

    it('does the right thing', () => {
      expect(Transformer('library.getImages', data)).toEqual(data);
    });
  });

  describe('tracklist.add', () => {
    const data = 'data';

    it('does the right thing', () => {
      expect(Transformer('tracklist.add', data)).toEqual(data);
    });
  });

  describe('mixer.getVolume', () => {
    const data = 'data';

    it('does the right thing', () => {
      expect(Transformer('mixer.getVolume', data)).toEqual(data);
    });
  });

  describe('mixer.setVolume', () => {
    const data = 'data';

    it('does the right thing', () => {
      expect(Transformer('mixer.setVolume', data)).toEqual(data);
    });
  });

  describe('playback.next', () => {
    const data = 'data';

    it('does the right thing', () => {
      expect(Transformer('playback.next', data)).toEqual(data);
    });
  });

  describe('unknown', () => {
    const data = 'data';

    it('does the right thing', () => {
      expect(Transformer('unknown', data)).toEqual('BACKEND RESPONSE NOT HANDLED: unknown');
    });
  });
});
