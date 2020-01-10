import Transformer from './index'
import TransformTrack from 'utils/transformer/transformers/mopidy/track'
import TransformTracklist from 'utils/transformer/transformers/mopidy/tracklist'
import TransformSearchResults from 'utils/transformer/transformers/spotify/search'
import settings from 'utils/local-storage'
import Spotify from 'services/spotify'
import NowPlaying from 'handlers/now-playing'

const mockTrack = {
  uri: 'spotify:track:40riOy7x9W7GXjyGp4pjAv',
  length: 123456
}
jest.mock('utils/transformer/transformers/mopidy/track', () => {
  return jest.fn(() => ({
    track: mockTrack
  }))
})
jest.mock('utils/local-storage')
jest.mock('services/spotify')
jest.mock('handlers/now-playing')
jest.mock('utils/transformer/transformers/spotify/search')
jest.mock('./transformers/mopidy/tracklist', () => {
  return jest.fn().mockImplementation(() => Promise.resolve(
    [{ track: { uri: '123' } }]
  ))
})

jest.useFakeTimers()

let data = 'data'

describe('Transformer', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const h = (key) => {
    return {
      encoded_key: key
    }
  }

  describe('playback.getCurrentTrack', () => {
    it('transforms when we have data', () => {
      expect.assertions(2)
      TransformTracklist.mockResolvedValue([{ track: { uri: '123', length: 2820123 } }])
      return Transformer.message(h('mopidy::playback.getCurrentTrack'), data).then(() => {
        expect(TransformTracklist).toHaveBeenCalledWith([data])
        expect(settings.setItem).toHaveBeenCalledWith(
          'track.current',
          '123'
        )
      })
    })

    it('does not transform when we have no data', () => {
      expect.assertions(1)
      return Transformer.message(h('mopidy::playback.getCurrentTrack'), null)
        .then(() => expect(TransformTrack).not.toHaveBeenCalled())
    })
  })

  describe('playback.getTimePosition', () => {
    it('returns the data that was passed in', () => {
      expect.assertions(1)
      return Transformer.message(h('mopidy::playback.getTimePosition'), data)
        .then(returnData => expect(returnData).toEqual(data))
    })
  })

  describe('tracklist.getTracks', () => {
    it('calls the TransformTracklist class, passes it into the settings and returns the result', () => {
      expect.assertions(3)
      TransformTracklist.mockResolvedValue([{ track: { uri: '123', length: 2820123 } }])
      return Transformer.message(h('mopidy::tracklist.getTracks'), data).then((returnData) => {
        expect(TransformTracklist).toHaveBeenCalledWith(data)
        expect(settings.setItem).toHaveBeenCalledWith('tracklist.current', ['123'])
        expect(returnData).toEqual([{ track: { uri: '123', length: 2820123 } }])
      })
    })
  })

  describe('event:trackPlaybackStarted', () => {
    it('does recommend if there are recomendations', () => {
      data = { tl_track: { track: 'data' } }
      const mopidyMock = jest.fn()
      expect.assertions(5)
      TransformTracklist.mockResolvedValue([{ track: { uri: '123', length: 2820123 } }])
      const recomendMock = jest.fn()
      Spotify.canRecommend.mockResolvedValue('functionName')
      return Transformer.mopidyCoreMessage(h('mopidy::event:trackPlaybackStarted'), data, mopidyMock).then((response) => {
        expect(settings.addToUniqueArray).toHaveBeenCalledWith(
          'tracklist.last_played',
          '123',
          10
        )
        expect(settings.setItem).toHaveBeenCalledWith(
          'track.current',
          '123'
        )
        expect(setTimeout).toHaveBeenCalled(
          recomendMock(),
          123456,
          [],
          mopidyMock
        )
        expect(NowPlaying.addTrack).toHaveBeenCalledWith({
          length: 2820123,
          uri: '123'
        })
        expect(response).toEqual({
          track: {
            length: 2820123,
            uri: '123'
          }
        })
      })
    })

    it('does not recommend if there are no recomendation', () => {
      data = { tl_track: { track: 'data' } }
      const mopidyMock = jest.fn()
      expect.assertions(5)
      TransformTracklist.mockResolvedValue([{ track: { uri: '123' } }])
      Spotify.canRecommend.mockResolvedValue(null)
      return Transformer.mopidyCoreMessage(h('mopidy::event:trackPlaybackStarted'), data, mopidyMock).then((response) => {
        expect(settings.addToUniqueArray).toHaveBeenCalledWith(
          'tracklist.last_played',
          '123',
          10
        )
        expect(settings.setItem).toHaveBeenCalledWith(
          'track.current',
          '123'
        )
        expect(setTimeout).not.toHaveBeenCalled()
        expect(NowPlaying.addTrack).toHaveBeenCalledWith({
          uri: '123'
        })
        expect(response).toEqual({
          track: {
            uri: '123'
          }
        })
      })
    })
  })

  describe('event:tracklistChanged', () => {
    it('returns the data passed in', () => {
      expect.assertions(1)
      return Transformer.mopidyCoreMessage(h('mopidy::event:tracklistChanged'), data)
        .then(returnData => expect(returnData).toEqual(data))
    })
  })

  describe('event:volumeChanged', () => {
    it('returns the volume data passed in', () => {
      data = { volume: 99 }
      expect.assertions(1)
      return Transformer.mopidyCoreMessage(h('mopidy::event:volumeChanged'), data)
        .then(returnData => expect(returnData).toEqual(data.volume))
    })
  })

  describe('event:playbackStateChanged', () => {
    it('returns the playback state data passed in', () => {
      data = { new_state: 'playing' }
      expect.assertions(1)
      return Transformer.mopidyCoreMessage(h('mopidy::event:playbackStateChanged'), data)
        .then(returnData => expect(returnData).toEqual(data.new_state))
    })
  })

  describe('tracklist.remove', () => {
    it('removes the track from the revently played array returns the data passed in', () => {
      data = [{
        track: { uri: 'spotify:track:43xy5ZmjM9tdzmrXu1pmSG' }
      }]
      expect.assertions(2)
      return Transformer.message(h('mopidy::tracklist.remove'), data).then(returnData => {
        expect(returnData).toEqual(data)
        expect(settings.removeFromArray.mock.calls[0])
          .toEqual(['tracklist.last_played', 'spotify:track:43xy5ZmjM9tdzmrXu1pmSG'])
      })
    })
  })

  describe('tracklist.clear', () => {
    it('returns the data passed in', () => {
      expect.assertions(1)
      return Transformer.message(h('mopidy::tracklist.clear'), data)
        .then(returnData => expect(returnData).toEqual(data))
    })
  })

  describe('mixer.getVolume', () => {
    it('returns the data passed in', () => {
      expect.assertions(1)
      return Transformer.message(h('mopidy::mixer.getVolume'), data)
        .then(returnData => expect(returnData).toEqual(data))
    })
  })

  describe('mixer.setVolume', () => {
    it('returns the data passed in', () => {
      expect.assertions(1)
      return Transformer.message(h('mopidy::mixer.setVolume'), data)
        .then(returnData => expect(returnData).toEqual(data))
    })
  })

  describe('tracklist.add', () => {
    it('returns the data passed in', () => {
      data = [{
        track: { uri: 'spotify:track:43xy5ZmjM9tdzmrXu1pmSG' }
      }]
      let headers = h('mopidy::tracklist.add')
      headers.data = {
        track: {
          uri: 'spotify:track:43xy5ZmjM9tdzmrXu1pmSG'
        }
      }
      expect.assertions(2)
      return Transformer.message(headers, data)
        .then(returnData => {
          expect(returnData).toEqual({ track: mockTrack })
          expect(TransformTrack).toHaveBeenCalledWith(data[0].track)
        })
    })
  })

  describe('playback.next', () => {
    it('returns a transformed track', () => {
      data = [{
        track: { uri: 'spotify:track:43xy5ZmjM9tdzmrXu1pmSG' }
      }]
      expect.assertions(1)
      return Transformer.message(h('mopidy::playback.next'), data)
        .then(returnData => expect(returnData).toEqual({ track: mockTrack }))
    })

    it('returns null if no data', () => {
      expect.assertions(1)
      return Transformer.message(h('mopidy::playback.next'), [])
        .then(returnData => expect(returnData).toBeUndefined())
    })
  })

  describe('playback.previous', () => {
    it('returns a transformed track', () => {
      data = [{
        track: { uri: 'spotify:track:43xy5ZmjM9tdzmrXu1pmSG' }
      }]
      expect.assertions(1)
      return Transformer.message(h('mopidy::playback.previous'), data)
        .then(returnData => expect(returnData).toEqual({ track: mockTrack }))
    })

    it('returns null if no data', () => {
      expect.assertions(1)
      return Transformer.message(h('mopidy::playback.previous'), [])
        .then(returnData => expect(returnData).toBeUndefined())
    })
  })

  describe('when passing an unknown key into Transform.message', () => {
    it('returns with a skippedTransform message', () => {
      expect.assertions(1)
      return Transformer.message(h('unknown'), data)
        .then(returnData => expect(returnData).toEqual('skippedTransform: unknown'))
    })
  })

  describe('when passing an unknown key into Transform.mopidyCoreMessage', () => {
    it('returns with a skippedTransform message', () => {
      expect.assertions(1)
      return Transformer.mopidyCoreMessage(h('unknown'), data)
        .then(returnData => expect(returnData).toEqual('mopidySkippedTransform: unknown'))
    })
  })

  describe('search::getTracks', () => {
    it('returns the data passed in', () => {
      const searchResults = ['item1updated', 'item2updated']
      data = { tracks: { items: ['item1', 'item2'] } }
      expect.assertions(1)
      TransformSearchResults.mockReturnValue(searchResults)
      return Transformer.message(h('search::getTracks'), data)
        .then(returnData => expect(returnData).toEqual(
          { tracks: { items: ['item1updated', 'item2updated'] } }))
    })
  })
})
