import Transformer from './index'
import TransformTrack from './transformers/mopidy/track'
import TransformTracklist from './transformers/mopidy/tracklist'
import settings from 'utils/local-storage'
import Spotify from 'services/spotify'
import NowPlaying from 'handlers/now-playing'

jest.mock('./transformers/mopidy/track', () => {
  return jest.fn(() => ({
    track: {
      uri: 'spotify:track:40riOy7x9W7GXjyGp4pjAv',
      length: 123456
    }
  }))
})
jest.mock('utils/local-storage')
jest.mock('services/mopidy/tracklist-trimmer')
jest.mock('services/spotify', () => ({
  canRecommend: jest.fn((_, fn) => fn('function'))
}))
jest.mock('handlers/now-playing')
jest.mock('./transformers/mopidy/tracklist')
jest.useFakeTimers()

describe('Transformer', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('playback.getCurrentTrack', () => {
    const data = 'data'

    it('transforms when we have data', () => {
      Transformer.message('mopidy::playback.getCurrentTrack', data)
      expect(TransformTrack).toHaveBeenCalledWith(data)
    })

    it('does not transform when we have no data', () => {
      Transformer.message('mopidy::playback.getCurrentTrack', null)
      expect(TransformTrack).not.toHaveBeenCalled()
    })
  })

  describe('playback.getTimePosition', () => {
    const data = 'data'

    it('does the right thing', () => {
      expect(Transformer.message('mopidy::playback.getTimePosition', data)).toEqual(data)
    })
  })

  describe('tracklist.getTracks', () => {
    const data = 'data'

    it('does the right thing', () => {
      TransformTracklist.mockReturnValue([{ track: { uri: '123' } }])
      Transformer.message('mopidy::tracklist.getTracks', data)
      expect(TransformTracklist).toHaveBeenCalledWith(data)
    })
  })

  describe('event:trackPlaybackStarted', () => {
    const data = { tl_track: { track: 'data' } }
    const mopidyMock = jest.fn()

    it('does the right thing', () => {
      Transformer.mopidyCoreMessage('mopidy::event:trackPlaybackStarted', data, mopidyMock)
      expect(TransformTrack).toHaveBeenCalledWith(data.tl_track.track)
      expect(NowPlaying.addTrack).toHaveBeenCalledWith({
        uri: 'spotify:track:40riOy7x9W7GXjyGp4pjAv',
        length: 123456
      })
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
      expect(Transformer.mopidyCoreMessage('mopidy::event:tracklistChanged', data)).toEqual(data)
    })
  })

  describe('event:volumeChanged', () => {
    const data = { volume: 99 }

    it('does the right thing', () => {
      expect(Transformer.mopidyCoreMessage('mopidy::event:volumeChanged', data)).toEqual(data.volume)
    })
  })

  describe('event:playbackStateChanged', () => {
    const data = { new_state: 'playing' }

    it('does the right thing', () => {
      expect(Transformer.mopidyCoreMessage('mopidy::event:playbackStateChanged', data))
        .toEqual(data.new_state)
    })
  })

  describe('library.getImages', () => {
    const data = 'data'

    it('does the right thing', () => {
      expect(Transformer.message('mopidy::library.getImages', data)).toEqual(data)
    })
  })

  describe('tracklist.add', () => {
    const data = 'data'

    it('does the right thing', () => {
      expect(Transformer.message('mopidy::tracklist.add', data)).toEqual(data)
    })
  })

  describe('tracklist.remove', () => {
    const data = [{
      track: { uri: 'spotify:track:43xy5ZmjM9tdzmrXu1pmSG' }
    }]

    it('does the right thing', () => {
      expect(Transformer.message('mopidy::tracklist.remove', data)).toEqual(data)
      expect(settings.removeFromArray.mock.calls[0])
        .toEqual(['tracklist.last_played', 'spotify:track:43xy5ZmjM9tdzmrXu1pmSG'])
    })
  })

  describe('tracklist.clear', () => {
    const data = 'data'

    it('does the right thing', () => {
      expect(Transformer.message('mopidy::tracklist.clear', data)).toEqual(data)
    })
  })

  describe('mixer.getVolume', () => {
    const data = 'data'

    it('does the right thing', () => {
      expect(Transformer.message('mopidy::mixer.getVolume', data)).toEqual(data)
    })
  })

  describe('mixer.setVolume', () => {
    const data = 'data'

    it('does the right thing', () => {
      expect(Transformer.message('mopidy::mixer.setVolume', data)).toEqual(data)
    })
  })

  describe('playback.next', () => {
    const data = 'data'

    it('does the right thing', () => {
      expect(Transformer.message('mopidy::playback.next', data)).toEqual(data)
    })
  })

  describe('unknown', () => {
    const data = 'data'

    it('does the right thing', () => {
      expect(Transformer.message('unknown', data)).toEqual('skippedTransform: unknown')
      expect(Transformer.mopidyCoreMessage('unknown', data)).toEqual('mopidySkippedTransform: unknown')
    })
  })
})
