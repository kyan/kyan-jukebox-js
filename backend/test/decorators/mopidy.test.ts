import DecorateTrack from '../../src/decorators/track'
import DecorateTracklist from '../../src/decorators/tracklist'
import Spotify from '../../src/services/spotify'
import NowPlaying from '../../src/utils/now-playing'
import {
  addTracks,
  updateTrackPlaycount,
  tracksToHumanReadableArray
} from '../../src/models/track'
import Setting, {
  getSeedTracks,
  removeFromSeeds,
  updateTracklist
} from '../../src/models/setting'
import MopidyDecorator from '../../src/decorators/mopidy'
import Mopidy from 'mopidy'
jest.mock('../../src/services/spotify')
jest.mock('../../src/utils/now-playing')
jest.mock('../../src/decorators/track')
jest.mock('../../src/decorators/tracklist')
jest.mock('../../src/models/track')
jest.mock('../../src/models/setting')

jest.useFakeTimers()

const mockUpdateCurrentTrack = Setting.updateCurrentTrack as jest.Mock
const mockUpdateTracklist = updateTracklist as jest.Mock
const mockClearState = Setting.clearState as jest.Mock
const mockDecorateTracklist = DecorateTracklist as jest.Mock
const mockTrimTracklist = Setting.trimTracklist as jest.Mock
const mockAddToTrackSeedList = Setting.addToTrackSeedList as jest.Mock
const mockGetSeedTracks = getSeedTracks as jest.Mock
const mockRemoveFromSeeds = removeFromSeeds as jest.Mock
const mockAddTracks = addTracks as jest.Mock
const mockTracksToHumanReadableArray = tracksToHumanReadableArray as jest.Mock
const mockUpdateTrackPlaycount = updateTrackPlaycount as jest.Mock
const mockSpotifyCanRecommend = Spotify.canRecommend as jest.Mock

describe('MopidyDecorator', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const h = (key: string): any => {
    return { key }
  }

  describe('playback.getCurrentTrack', () => {
    it('transforms when we have data', async () => {
      const data = 'data'
      expect.assertions(2)
      mockUpdateCurrentTrack.mockResolvedValue(true)
      mockDecorateTracklist.mockResolvedValue([
        { track: { uri: '123', length: 2820123 } }
      ])
      const response = await MopidyDecorator.parse(h('playback.getCurrentTrack'), data)
      expect(DecorateTracklist).toHaveBeenCalledWith([data])
      expect(response).toEqual({ track: { length: 2820123, uri: '123' } })
    })

    it('does not transform when we have no data', async () => {
      expect.assertions(1)
      await MopidyDecorator.parse(h('playback.getCurrentTrack'), null)
      return expect(DecorateTrack).not.toHaveBeenCalled()
    })
  })

  describe('playback.getTimePosition', () => {
    it('returns the data that was passed in', async () => {
      const data = 'data'
      expect.assertions(1)
      const returnData = await MopidyDecorator.parse(h('playback.getTimePosition'), data)
      return expect(returnData).toEqual(data)
    })
  })

  describe('tracklist.getTracks', () => {
    it('calls the DecorateTracklist class, passes it into the settings and returns the result', async () => {
      const data = 'data'
      expect.assertions(3)
      mockDecorateTracklist.mockResolvedValue([
        { track: { uri: '123', length: 2820123 } }
      ])
      mockUpdateTracklist.mockResolvedValue(true)
      const returnData = await MopidyDecorator.parse(h('tracklist.getTracks'), data)
      expect(DecorateTracklist).toHaveBeenCalledWith(data)
      expect(updateTracklist).toBeCalledWith(['123'])
      expect(returnData).toEqual([{ track: { uri: '123', length: 2820123 } }])
    })
  })

  describe('event:trackPlaybackEnded', () => {
    it('correctly calls through', async () => {
      expect.assertions(3)
      const data = { tl_track: { track: 'track' } }
      const decoratedData = [{ track: { uri: '123', length: 2820123 } }]
      const mopidyMock = jest.fn() as unknown
      mockDecorateTracklist.mockResolvedValue(decoratedData)
      mockAddToTrackSeedList.mockResolvedValue(true)
      mockTrimTracklist.mockResolvedValue(true)

      const response = await MopidyDecorator.mopidyCoreMessage(
        h('event:trackPlaybackEnded'),
        data,
        mopidyMock as Mopidy
      )
      expect(Setting.addToTrackSeedList).toHaveBeenCalledWith(decoratedData[0].track)
      expect(Setting.trimTracklist).toHaveBeenCalledWith(mopidyMock)
      expect(response).toEqual('123')
    })
  })

  describe('event:trackPlaybackStarted', () => {
    it('does recommend if there are recomendations', async () => {
      expect.assertions(4)
      const recomendMock = 'mockRecommend'
      const data = { tl_track: { track: { uri: 'uri123' } } }
      const mopidyMock = jest.fn() as unknown
      mockUpdateTrackPlaycount.mockResolvedValue(true)
      mockDecorateTracklist.mockResolvedValue([
        { track: { uri: '123', length: 2820123 } }
      ])
      mockUpdateCurrentTrack.mockResolvedValue(true)
      mockSpotifyCanRecommend.mockResolvedValue(recomendMock)
      mockGetSeedTracks.mockResolvedValue('seedTracks')

      const response = await MopidyDecorator.mopidyCoreMessage(
        h('event:trackPlaybackStarted'),
        data,
        mopidyMock as Mopidy
      )
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

    it('does not recommend if there are no recomendation', async () => {
      expect.assertions(4)
      const data = { tl_track: { track: { uri: 'uri123' } } }
      const mopidyMock = jest.fn() as unknown
      mockUpdateTrackPlaycount.mockResolvedValue(true)
      mockDecorateTracklist.mockResolvedValue([{ track: { uri: '123' } }])
      mockSpotifyCanRecommend.mockResolvedValue(null)
      mockUpdateCurrentTrack.mockResolvedValue(true)

      const response = await MopidyDecorator.mopidyCoreMessage(
        h('event:trackPlaybackStarted'),
        data,
        mopidyMock as Mopidy
      )
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

  describe('event:volumeChanged', () => {
    it('returns the volume data passed in', async () => {
      const data = { volume: 99 }
      const mopidyMock = jest.fn() as unknown
      expect.assertions(1)
      const returnData = await MopidyDecorator.mopidyCoreMessage(
        h('event:volumeChanged'),
        data,
        mopidyMock as Mopidy
      )
      return expect(returnData).toEqual({ volume: 99 })
    })
  })

  describe('event:playbackResumed', () => {
    it('returns the seek position', async () => {
      const data = { time_position: 99 }
      const mopidyMock = jest.fn() as unknown
      expect.assertions(1)
      const returnData = await MopidyDecorator.mopidyCoreMessage(
        h('event:trackPlaybackResumed'),
        data,
        mopidyMock as Mopidy
      )
      return expect(returnData).toEqual(data.time_position)
    })
  })

  describe('event:playbackStateChanged', () => {
    it('returns the playback state data passed in', async () => {
      const data = { new_state: 'playing' }
      const mopidyMock = jest.fn() as unknown
      expect.assertions(1)
      const returnData = await MopidyDecorator.mopidyCoreMessage(
        h('event:playbackStateChanged'),
        data,
        mopidyMock as Mopidy
      )
      return expect(returnData).toEqual(data.new_state)
    })
  })

  describe('tracklist.remove', () => {
    it('removes the track from the recently played array returns the data passed in', async () => {
      const data = [
        {
          track: { uri: 'spotify:track:43xy5ZmjM9tdzmrXu1pmSG' }
        }
      ]
      const response = [{ track: { name: 'track', artist: { name: 'artist' } } }]
      expect.assertions(2)
      mockDecorateTracklist.mockResolvedValue(response)
      mockRemoveFromSeeds.mockResolvedValue(true)
      mockAddTracks.mockResolvedValue(true)
      mockTracksToHumanReadableArray.mockReturnValue(['track'])
      const returnData = await MopidyDecorator.parse(h('tracklist.remove'), data)
      expect(returnData).toEqual({
        message: 'track',
        toAll: true
      })
      expect(removeFromSeeds).toHaveBeenCalledWith('spotify:track:43xy5ZmjM9tdzmrXu1pmSG')
    })
  })

  describe('tracklist.clear', () => {
    it('returns the data passed in', async () => {
      expect.assertions(1)
      mockClearState.mockResolvedValue(true)
      const data = 'data'
      const returnData = await MopidyDecorator.parse(h('tracklist.clear'), data)
      return expect(returnData).toEqual(data)
    })
  })

  describe('mixer.getVolume', () => {
    it('returns the data passed in', async () => {
      expect.assertions(1)
      const data = 12
      const returnData = await MopidyDecorator.parse(h('mixer.getVolume'), data)
      return expect(returnData).toEqual({ volume: 12 })
    })
  })

  describe('mixer.setVolume', () => {
    it('returns the data passed in', async () => {
      expect.assertions(1)
      const headers = h('mixer.setVolume')
      headers.data = [12]
      const data = 'data'
      const returnData = await MopidyDecorator.parse(headers, data)
      expect(returnData).toEqual({
        toAll: true,
        volume: 12
      })
    })
  })

  describe('tracklist.add', () => {
    it('returns the data passed in', async () => {
      expect.assertions(3)
      const data = [{ track: { name: 'track', artist: { name: 'artist' } } }]
      const headers = h('tracklist.add')
      headers.data = { uris: ['spotify:track:43xy5ZmjM9tdzmrXu1pmSG'] }
      headers.user = 'user'
      mockDecorateTracklist.mockResolvedValue(data)
      mockAddTracks.mockResolvedValue(true)
      mockTracksToHumanReadableArray.mockReturnValue(['one', 'two'])

      const returnData = await MopidyDecorator.parse(headers, data)
      expect(addTracks).toHaveBeenCalledWith(
        ['spotify:track:43xy5ZmjM9tdzmrXu1pmSG'],
        'user'
      )
      expect(DecorateTracklist).toHaveBeenCalledWith([data[0].track])
      expect(returnData).toEqual({ message: 'one, two', toAll: true })
    })
  })

  describe('playback.next', () => {
    it('returns null', async () => {
      expect.assertions(1)
      const returnData = await MopidyDecorator.parse(h('playback.next'), [])
      return expect(returnData).toBeUndefined()
    })
  })

  describe('playback.previous', () => {
    it('returns null', async () => {
      expect.assertions(1)
      const returnData = await MopidyDecorator.parse(h('playback.previous'), [])
      return expect(returnData).toBeUndefined()
    })
  })

  describe('when passing an unknown key into Transform.message', () => {
    it('returns with a skippedTransform message', async () => {
      expect.assertions(1)
      const data = 'data'
      const returnData = await MopidyDecorator.parse(h('unknown'), data)
      return expect(returnData).toEqual('skippedTransform: unknown')
    })
  })

  describe('when passing an unknown key into Transform.mopidyCoreMessage', () => {
    it('returns with a skippedTransform message', async () => {
      expect.assertions(1)
      const mopidyMock = jest.fn() as unknown
      const data = 'data'
      const returnData = await MopidyDecorator.mopidyCoreMessage(
        h('unknown'),
        data,
        mopidyMock as Mopidy
      )
      return expect(returnData).toEqual('mopidySkippedTransform: unknown')
    })
  })
})
