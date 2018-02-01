import Transformer from './index'
import TransformTrack from '../transformers/mopidy/track'
import TransformTracklist from '../transformers/mopidy/tracklist'
jest.mock('../transformers/mopidy/track')
jest.mock('../transformers/mopidy/tracklist')

describe('Transformer', () => {
  describe('playback.getCurrentTrack', () => {
    const data = 'data'

    it('does the right thing', () => {
      Transformer('mopidy::playback.getCurrentTrack', data)
      expect(TransformTrack).toHaveBeenCalledWith(data)
    })
  })

  describe('playback.getTimePosition', () => {
    const data = 'data'

    it('does the right thing', () => {
      expect(Transformer('mopidy::playback.getTimePosition', data)).toEqual(data)
    })
  })

  describe('tracklist.getTracks', () => {
    const data = 'data'

    it('does the right thing', () => {
      Transformer('mopidy::tracklist.getTracks', data)
      expect(TransformTracklist).toHaveBeenCalledWith(data)
    })
  })

  describe('event:trackPlaybackStarted', () => {
    const data = { tl_track: { track: 'data' } }

    it('does the right thing', () => {
      Transformer('mopidy::event:trackPlaybackStarted', data)
      expect(TransformTrack).toHaveBeenCalledWith(data.tl_track.track)
    })
  })

  describe('event:tracklistChanged', () => {
    const data = 'data'

    it('does the right thing', () => {
      expect(Transformer('mopidy::event:tracklistChanged', data)).toEqual(data)
    })
  })

  describe('event:volumeChanged', () => {
    const data = { volume: 99 }

    it('does the right thing', () => {
      expect(Transformer('mopidy::event:volumeChanged', data)).toEqual(data.volume)
    })
  })

  describe('library.getImages', () => {
    const data = 'data'

    it('does the right thing', () => {
      expect(Transformer('mopidy::library.getImages', data)).toEqual(data)
    })
  })

  describe('tracklist.add', () => {
    const data = 'data'

    it('does the right thing', () => {
      expect(Transformer('mopidy::tracklist.add', data)).toEqual(data)
    })
  })

  describe('mixer.getVolume', () => {
    const data = 'data'

    it('does the right thing', () => {
      expect(Transformer('mopidy::mixer.getVolume', data)).toEqual(data)
    })
  })

  describe('mixer.setVolume', () => {
    const data = 'data'

    it('does the right thing', () => {
      expect(Transformer('mopidy::mixer.setVolume', data)).toEqual(data)
    })
  })

  describe('playback.next', () => {
    const data = 'data'

    it('does the right thing', () => {
      expect(Transformer('mopidy::playback.next', data)).toEqual(data)
    })
  })

  describe('unknown', () => {
    const data = 'data'

    it('does the right thing', () => {
      expect(Transformer('unknown', data)).toEqual('BACKEND RESPONSE NOT HANDLED: unknown')
    })
  })
})
