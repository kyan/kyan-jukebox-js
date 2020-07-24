import DecorateTrack from '../../src/decorators/track'
import DecorateTracklist from '../../src/decorators/tracklist'
import Spotify from '../../src/services/spotify'
import NowPlaying from '../../src/utils/now-playing'
import { addTracks, updateTrackPlaycount } from '../../src/models/track'
import {
  addToTrackSeedList,
  clearState,
  getSeedTracks,
  removeFromSeeds,
  trimTracklist,
  updateCurrentTrack,
  updateTracklist
} from '../../src/models/setting'
import MopidyDecorator from '../../src/decorators/mopidy'
jest.mock('../../src/services/spotify')
jest.mock('../../src/utils/now-playing')
jest.mock('../../src/decorators/track')
jest.mock('../../src/decorators/tracklist')
jest.mock('../../src/models/track')
jest.mock('../../src/models/setting')

jest.useFakeTimers()

describe('MopidyDecorator', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const h = (key) => {
    return { key }
  }

  describe('playback.getCurrentTrack', () => {
    it('transforms when we have data', () => {
      const data = 'data'
      expect.assertions(2)
      updateCurrentTrack.mockResolvedValue()
      DecorateTracklist.mockResolvedValue([{ track: { uri: '123', length: 2820123 } }])
      return MopidyDecorator.parse(h('playback.getCurrentTrack'), data).then(
        (response) => {
          expect(DecorateTracklist).toHaveBeenCalledWith([data])
          expect(response).toEqual({ track: { length: 2820123, uri: '123' } })
        }
      )
    })

    it('does not transform when we have no data', () => {
      expect.assertions(1)
      return MopidyDecorator.parse(h('playback.getCurrentTrack'), null).then(() =>
        expect(DecorateTrack).not.toHaveBeenCalled()
      )
    })
  })

  describe('playback.getTimePosition', () => {
    it('returns the data that was passed in', () => {
      const data = 'data'
      expect.assertions(1)
      return MopidyDecorator.parse(
        h('playback.getTimePosition'),
        data
      ).then((returnData) => expect(returnData).toEqual(data))
    })
  })

  describe('tracklist.getTracks', () => {
    it('calls the DecorateTracklist class, passes it into the settings and returns the result', () => {
      const data = 'data'
      expect.assertions(3)
      DecorateTracklist.mockResolvedValue([{ track: { uri: '123', length: 2820123 } }])
      updateTracklist.mockResolvedValue()
      return MopidyDecorator.parse(h('tracklist.getTracks'), data).then((returnData) => {
        expect(DecorateTracklist).toHaveBeenCalledWith(data)
        expect(updateTracklist).toBeCalledWith(['123'])
        expect(returnData).toEqual([{ track: { uri: '123', length: 2820123 } }])
      })
    })
  })

  describe('event:trackPlaybackEnded', () => {
    it('correctly calls through', () => {
      expect.assertions(3)
      const data = { tl_track: { track: 'track' } }
      const decoratedData = [{ track: { uri: '123', length: 2820123 } }]
      const mopidyMock = jest.fn()
      DecorateTracklist.mockResolvedValue(decoratedData)
      addToTrackSeedList.mockResolvedValue()
      trimTracklist.mockResolvedValue()

      return MopidyDecorator.mopidyCoreMessage(
        h('event:trackPlaybackEnded'),
        data,
        mopidyMock
      ).then((response) => {
        expect(addToTrackSeedList).toHaveBeenCalledWith(decoratedData[0].track)
        expect(trimTracklist).toHaveBeenCalledWith(mopidyMock)
        expect(response).toEqual('123')
      })
    })
  })

  describe('event:trackPlaybackStarted', () => {
    it('does recommend if there are recomendations', () => {
      expect.assertions(4)
      const recomendMock = 'mockRecommend'
      const data = { tl_track: { track: { uri: 'uri123' } } }
      const mopidyMock = jest.fn()
      updateTrackPlaycount.mockResolvedValue()
      DecorateTracklist.mockResolvedValue([{ track: { uri: '123', length: 2820123 } }])
      updateCurrentTrack.mockResolvedValue()
      Spotify.canRecommend.mockResolvedValue(recomendMock)
      getSeedTracks.mockResolvedValue('seedTracks')

      return MopidyDecorator.mopidyCoreMessage(
        h('event:trackPlaybackStarted'),
        data,
        mopidyMock
      ).then((response) => {
        expect(updateTrackPlaycount).toHaveBeenCalledWith('uri123')
        expect(setTimeout).toHaveBeenCalledWith(
          'mockRecommend',
          2115092.25,
          'seedTracks',
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
      expect.assertions(4)
      const data = { tl_track: { track: { uri: 'uri123' } } }
      const mopidyMock = jest.fn()
      updateTrackPlaycount.mockResolvedValue()
      DecorateTracklist.mockResolvedValue([{ track: { uri: '123' } }])
      Spotify.canRecommend.mockResolvedValue(null)
      updateCurrentTrack.mockResolvedValue()

      return MopidyDecorator.mopidyCoreMessage(
        h('event:trackPlaybackStarted'),
        data,
        mopidyMock
      ).then((response) => {
        expect(updateTrackPlaycount).toHaveBeenCalledWith('uri123')
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

  describe('event:volumeChanged', () => {
    it('returns the volume data passed in', () => {
      const data = { volume: 99 }
      expect.assertions(1)
      return MopidyDecorator.mopidyCoreMessage(
        h('event:volumeChanged'),
        data
      ).then((returnData) => expect(returnData).toEqual({ volume: 99 }))
    })
  })

  describe('event:playbackResumed', () => {
    it('returns the seek position', () => {
      const data = { time_position: 99 }
      expect.assertions(1)
      return MopidyDecorator.mopidyCoreMessage(
        h('event:trackPlaybackResumed'),
        data
      ).then((returnData) => expect(returnData).toEqual(data.time_position))
    })
  })

  describe('event:playbackStateChanged', () => {
    it('returns the playback state data passed in', () => {
      const data = { new_state: 'playing' }
      expect.assertions(1)
      return MopidyDecorator.mopidyCoreMessage(
        h('event:playbackStateChanged'),
        data
      ).then((returnData) => expect(returnData).toEqual(data.new_state))
    })
  })

  describe('tracklist.remove', () => {
    it('removes the track from the revently played array returns the data passed in', () => {
      const data = [
        {
          track: { uri: 'spotify:track:43xy5ZmjM9tdzmrXu1pmSG' }
        }
      ]
      const response = [{ track: { name: 'track', artist: { name: 'artist' } } }]
      expect.assertions(2)
      DecorateTracklist.mockResolvedValue(response)
      removeFromSeeds.mockResolvedValue()
      return MopidyDecorator.parse(h('tracklist.remove'), data).then((returnData) => {
        expect(returnData).toEqual({
          message: 'track by artist',
          toAll: true
        })
        expect(removeFromSeeds).toHaveBeenCalledWith(
          'spotify:track:43xy5ZmjM9tdzmrXu1pmSG'
        )
      })
    })
  })

  describe('tracklist.clear', () => {
    it('returns the data passed in', () => {
      expect.assertions(1)
      clearState.mockResolvedValue()
      const data = 'data'
      return MopidyDecorator.parse(h('tracklist.clear'), data).then((returnData) =>
        expect(returnData).toEqual(data)
      )
    })
  })

  describe('mixer.getVolume', () => {
    it('returns the data passed in', () => {
      expect.assertions(1)
      const data = 12
      return MopidyDecorator.parse(h('mixer.getVolume'), data).then((returnData) =>
        expect(returnData).toEqual({ volume: 12 })
      )
    })
  })

  describe('mixer.setVolume', () => {
    it('returns the data passed in', () => {
      expect.assertions(1)
      let headers = h('mixer.setVolume')
      headers.data = [12]
      const data = 'data'
      return MopidyDecorator.parse(headers, data).then((returnData) => {
        expect(returnData).toEqual({
          toAll: true,
          volume: 12
        })
      })
    })
  })

  describe('tracklist.add', () => {
    it('returns the data passed in', () => {
      expect.assertions(3)
      const data = [{ track: { name: 'track', artist: { name: 'artist' } } }]
      let headers = h('tracklist.add')
      headers.data = { uris: ['spotify:track:43xy5ZmjM9tdzmrXu1pmSG'] }
      headers.user = 'user'
      DecorateTracklist.mockResolvedValue(data)
      addTracks.mockResolvedValue()

      return MopidyDecorator.parse(headers, data).then((returnData) => {
        expect(addTracks).toHaveBeenCalledWith(
          ['spotify:track:43xy5ZmjM9tdzmrXu1pmSG'],
          'user'
        )
        expect(DecorateTracklist).toHaveBeenCalledWith([data[0].track])
        expect(returnData).toEqual({ message: 'track by artist', toAll: true })
      })
    })
  })

  describe('playback.next', () => {
    it('returns null', () => {
      expect.assertions(1)

      return MopidyDecorator.parse(h('playback.next'), []).then((returnData) =>
        expect(returnData).toBeUndefined()
      )
    })
  })

  describe('playback.previous', () => {
    it('returns null', () => {
      expect.assertions(1)
      return MopidyDecorator.parse(h('playback.previous'), []).then((returnData) =>
        expect(returnData).toBeUndefined()
      )
    })
  })

  describe('when passing an unknown key into Transform.message', () => {
    it('returns with a skippedTransform message', () => {
      expect.assertions(1)
      const data = 'data'
      return MopidyDecorator.parse(h('unknown'), data).then((returnData) =>
        expect(returnData).toEqual('skippedTransform: unknown')
      )
    })
  })

  describe('when passing an unknown key into Transform.mopidyCoreMessage', () => {
    it('returns with a skippedTransform message', () => {
      expect.assertions(1)
      const data = 'data'
      return MopidyDecorator.mopidyCoreMessage(h('unknown'), data).then((returnData) =>
        expect(returnData).toEqual('mopidySkippedTransform: unknown')
      )
    })
  })
})
