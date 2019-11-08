import Transformer from './index'
import TransformTrack from './transformers/mopidy/track'
import TransformTracklist from './transformers/mopidy/tracklist'
import settings from '../local-storage'
import Spotify from '../services/spotify'
jest.mock('./transformers/mopidy/track', () => {
  return jest.fn(() => ({
    track: {
      uri: 'spotify:track:40riOy7x9W7GXjyGp4pjAv',
      length: 123456
    }
  }))
})
jest.mock('../local-storage')
jest.mock('../services/mopidy/tracklist-trimmer')
jest.mock('../services/spotify', () => ({
  canRecommend: jest.fn((_, fn) => fn('function'))
}))
jest.mock('./transformers/mopidy/tracklist')
jest.useFakeTimers()

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
      TransformTracklist.mockReturnValue([{ track: { uri: '123' } }])
      Transformer('mopidy::tracklist.getTracks', data)
      expect(TransformTracklist).toHaveBeenCalledWith(data)
    })
  })

  describe('event:trackPlaybackStarted', () => {
    const data = { tl_track: { track: 'data' } }
    const mopidyMock = jest.fn()

    it('does the right thing', () => {
      Transformer('mopidy::event:trackPlaybackStarted', data, mopidyMock)
      expect(TransformTrack).toHaveBeenCalledWith(data.tl_track.track)
      expect(settings.addToUniqueArray.mock.calls[0])
        .toEqual(['tracklist.last_played', 'spotify:track:40riOy7x9W7GXjyGp4pjAv', 10])
      expect(Spotify.canRecommend.mock.calls[0])
        .toEqual([mopidyMock, expect.any(Function)])
      expect(setTimeout.mock.calls[0])
        .toEqual(['function', 92592, [], mopidyMock])
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

  describe('event:playbackStateChanged', () => {
    const data = { new_state: 'playing' }

    it('does the right thing', () => {
      expect(Transformer('mopidy::event:playbackStateChanged', data))
        .toEqual(data.new_state)
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

  describe('tracklist.remove', () => {
    const data = 'data'

    it('does the right thing', () => {
      expect(Transformer('mopidy::tracklist.remove', data)).toEqual(data)
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
