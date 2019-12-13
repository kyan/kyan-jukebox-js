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

let data = 'data'

describe('Transformer', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('playback.getCurrentTrack', () => {
    it('transforms when we have data', () => {
      expect.assertions(1);
      return Transformer.message('mopidy::playback.getCurrentTrack', data).then(() => expect(TransformTrack).toHaveBeenCalledWith(data))
    })

    it('does not transform when we have no data', () => {
      expect.assertions(1);
      return Transformer.message('mopidy::playback.getCurrentTrack', null).then(() => expect(TransformTrack).not.toHaveBeenCalled())
    })
  })

  describe('playback.getTimePosition', () => {
    it('returns the data that was passed in', () => {
      expect.assertions(1);
      return Transformer.message('mopidy::playback.getTimePosition', data).then(returnData => expect(returnData).toEqual(data))
    })
  })

  describe('tracklist.getTracks', () => {
    it('calls the TransformTracklist class, passes it into the settings and returns the result', () => {
      expect.assertions(3);
      TransformTracklist.mockReturnValue([{ track: { uri: '123' } }])
      return Transformer.message('mopidy::tracklist.getTracks', data).then((returnData) => {
        expect(TransformTracklist).toHaveBeenCalledWith(data)
        expect(settings.setItem).toHaveBeenCalledWith('tracklist.current', ['123'])
        expect(returnData).toEqual([{"track": {"uri": "123"}}])
      })
    })
  })

  describe('event:trackPlaybackStarted', () => {
    it('transforms the track, passes to NowPlaying and sets up Spotify recommendations', () => {
      data = { tl_track: { track: 'data' } }
      const mopidyMock = jest.fn()
      expect.assertions(5);
      return Transformer.mopidyCoreMessage('mopidy::event:trackPlaybackStarted', data, mopidyMock).then(() => {
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
  })

  describe('event:tracklistChanged', () => {
    it('returns the data passed in', () => {
      expect.assertions(1);
      return Transformer.mopidyCoreMessage('mopidy::event:tracklistChanged', data).then(returnData => expect(returnData).toEqual(data))
    })
  })

  describe('event:volumeChanged', () => {
    data = { volume: 99 }

    it('returns the volume data passed in', () => {
      expect.assertions(1);
      return Transformer.mopidyCoreMessage('mopidy::event:volumeChanged', data).then(returnData => expect(returnData).toEqual(data.volume))
    })
  })

  describe('event:playbackStateChanged', () => {
    data = { new_state: 'playing' }

    it('returns the playback state data passed in', () => {
      expect.assertions(1);
      return Transformer.mopidyCoreMessage('mopidy::event:playbackStateChanged', data).then(returnData => expect(returnData).toEqual(data.new_state))
    })
  })

  describe('library.getImages', () => {
    it('returns the data passed in', () => {
      expect.assertions(1);
      return Transformer.message('mopidy::library.getImages', data).then(returnData => expect(returnData).toEqual(data))
    })
  })

  describe('tracklist.add', () => {
    it('returns the data passed in', () => {
      expect.assertions(1);
      return Transformer.message('mopidy::tracklist.add', data).then(returnData => expect(returnData).toEqual(data))
    })
  })

  describe('tracklist.remove', () => {
    it('removes the track from the revently played array returns the data passed in', () => {
      data = [{
        track: { uri: 'spotify:track:43xy5ZmjM9tdzmrXu1pmSG' }
      }]
      expect.assertions(2);
      return Transformer.message('mopidy::tracklist.remove', data).then(returnData => {
        expect(returnData).toEqual(data)
        expect(settings.removeFromArray.mock.calls[0])
        .toEqual(['tracklist.last_played', 'spotify:track:43xy5ZmjM9tdzmrXu1pmSG'])
      })
    })
  })

  describe('tracklist.clear', () => {
    it('returns the data passed in', () => {
      expect.assertions(1);
      return Transformer.message('mopidy::tracklist.clear', data).then(returnData => expect(returnData).toEqual(data))
    })
  })

  describe('mixer.getVolume', () => {
    it('returns the data passed in', () => {
      expect.assertions(1);
      return Transformer.message('mopidy::mixer.getVolume', data).then(returnData => expect(returnData).toEqual(data))
    })
  })

  describe('mixer.setVolume', () => {
    it('returns the data passed in', () => {
      expect.assertions(1);
      return Transformer.message('mopidy::mixer.setVolume', data).then(returnData => expect(returnData).toEqual(data))
    })
  })

  describe('playback.next', () => {
    it('returns the data passed in', () => {
      expect.assertions(1);
      return Transformer.message('mopidy::playback.next', data).then(returnData => expect(returnData).toEqual(data))
    })
  })

  describe('when passing an unknown key into Transform.message', () => {
    it('returns with a skippedTransform message', () => {
      expect.assertions(1);
      return Transformer.message('unknown', data).then(returnData => expect(returnData).toEqual('skippedTransform: unknown'))
    })
  })

  describe('when passing an unknown key into Transform.mopidyCoreMessage', () => {
    it('returns with a skippedTransform message', () => {
      expect.assertions(1);
      return Transformer.mopidyCoreMessage('unknown', data).then(returnData => expect(returnData).toEqual('mopidySkippedTransform: unknown'))
    })
  })
})
