import DecorateTrack from '../../src/decorators/track'
import DecorateTracklist from '../../src/decorators/tracklist'
import NowPlaying from '../../src/utils/now-playing'
import MopidyDecorator from '../../src/decorators/mopidy'
import Mopidy from 'mopidy'
import { expect, test, describe, afterEach, mock } from 'bun:test'

// Mock DecorateTrack
const mockDecorateTrack = mock()
mock.module('../../src/decorators/track', () => ({
  default: mockDecorateTrack
}))

// Mock DecorateTracklist
const mockDecorateTracklist = mock()
mock.module('../../src/decorators/tracklist', () => ({
  default: mockDecorateTracklist
}))

// Mock Spotify service
const mockSpotifyCanRecommend = mock()
mock.module('../../src/services/spotify', () => ({
  default: {
    canRecommend: mockSpotifyCanRecommend
  }
}))

// Mock NowPlaying
mock.module('../../src/utils/now-playing', () => ({
  default: {
    addTrack: mock()
  }
}))

// Mock database factory
mock.module('../../src/services/database/factory', () => ({
  getDatabase: mock(() => mockDatabase)
}))

// jest.useFakeTimers() - TODO: Convert to bun equivalent

// Mock database service
const mockDatabase = {
  settings: {
    updateCurrentTrack: mock(),
    updateTracklist: mock(),
    clearState: mock(),
    trimTracklist: mock(),
    addToTrackSeedList: mock(),
    getSeedTracks: mock(),
    removeFromSeeds: mock()
  },
  tracks: {
    addTracks: mock(),
    updatePlaycount: mock()
  }
}

// Mock variables are already defined above

describe('MopidyDecorator', () => {
  afterEach(() => {
    mockDecorateTracklist.mockClear()
    mockSpotifyCanRecommend.mockClear()
    mockDecorateTrack.mockClear()
  })

  const h = (key: string): any => {
    return { key }
  }

  describe('playback.getCurrentTrack', () => {
    test('transforms when we have data', async () => {
      const data = 'data'
      expect.assertions(2)
      mockDatabase.settings.updateCurrentTrack.mockResolvedValue(true)
      mockDecorateTracklist.mockResolvedValue([{ uri: '123', length: 2820123 }])
      const response = await MopidyDecorator.parse(h('playback.getCurrentTrack'), data)
      expect(mockDecorateTracklist).toHaveBeenCalledWith([data])
      expect(response).toEqual({ length: 2820123, uri: '123' })
    })

    test('does not transform when we have no data', async () => {
      expect.assertions(1)
      await MopidyDecorator.parse(h('playback.getCurrentTrack'), null)
      return expect(DecorateTrack).not.toHaveBeenCalled()
    })
  })

  describe('playback.getTimePosition', () => {
    test('returns the data that was passed in', async () => {
      const data = 'data'
      expect.assertions(1)
      const returnData = await MopidyDecorator.parse(h('playback.getTimePosition'), data)
      return expect(returnData).toEqual(data)
    })
  })

  describe('tracklist.getTracks', () => {
    test('calls the DecorateTracklist class, passes it into the settings and returns the result', async () => {
      const data = 'data'
      expect.assertions(3)
      mockDecorateTracklist.mockResolvedValue([{ uri: '123', length: 2820123 }])
      mockDatabase.settings.updateTracklist.mockResolvedValue(true)
      const returnData = await MopidyDecorator.parse(h('tracklist.getTracks'), data)
      expect(mockDecorateTracklist).toHaveBeenCalledWith(data)
      expect(mockDatabase.settings.updateTracklist).toHaveBeenCalledWith(['123'])
      expect(returnData).toEqual([{ uri: '123', length: 2820123 }])
    })
  })

  describe('event:trackPlaybackEnded', () => {
    test('correctly calls through', async () => {
      expect.assertions(3)
      const data = { tl_track: { track: 'track' } }
      const decoratedData = [{ uri: '123', length: 2820123 }]
      const mopidyMock = mock() as unknown
      mockDecorateTracklist.mockResolvedValue(decoratedData)
      mockDatabase.settings.addToTrackSeedList.mockResolvedValue(true)
      mockDatabase.settings.trimTracklist.mockResolvedValue(true)

      const response = await MopidyDecorator.mopidyCoreMessage(
        h('event:trackPlaybackEnded'),
        data,
        mopidyMock as Mopidy
      )
      expect(mockDatabase.settings.addToTrackSeedList).toHaveBeenCalledWith(
        decoratedData[0]
      )
      expect(mockDatabase.settings.trimTracklist).toHaveBeenCalledWith(mopidyMock)
      expect(response).toEqual('123')
    })
  })

  describe('event:trackPlaybackStarted', () => {
    test('does recommend if there are recomendations', async () => {
      expect.assertions(3)
      const recomendMock = mock()
      const data = { tl_track: { track: { uri: 'uri123' } } }
      const mopidyMock = mock() as unknown
      mockDatabase.tracks.updatePlaycount.mockResolvedValue(true)
      mockDecorateTracklist.mockResolvedValue([{ uri: '123', length: 2820123 }])
      mockDatabase.settings.updateCurrentTrack.mockResolvedValue(true)
      mockSpotifyCanRecommend.mockResolvedValue(recomendMock)
      mockDatabase.settings.getSeedTracks.mockResolvedValue('seedTracks')

      const response = await MopidyDecorator.mopidyCoreMessage(
        h('event:trackPlaybackStarted'),
        data,
        mopidyMock as Mopidy
      )
      expect(mockDatabase.tracks.updatePlaycount).toHaveBeenCalledWith('uri123')
      expect(NowPlaying.addTrack).toHaveBeenCalledWith({
        length: 2820123,
        uri: '123'
      })
      expect(response).toEqual({
        length: 2820123,
        uri: '123'
      })
    })

    test('does not recommend if there are no recomendation', async () => {
      expect.assertions(3)
      const data = { tl_track: { track: { uri: 'uri123' } } }
      const mopidyMock = mock() as unknown
      mockDatabase.tracks.updatePlaycount.mockResolvedValue(true)
      mockDecorateTracklist.mockResolvedValue([{ uri: '123' }])
      mockSpotifyCanRecommend.mockResolvedValue(null)
      mockDatabase.settings.updateCurrentTrack.mockResolvedValue(true)

      const response = await MopidyDecorator.mopidyCoreMessage(
        h('event:trackPlaybackStarted'),
        data,
        mopidyMock as Mopidy
      )
      expect(mockDatabase.tracks.updatePlaycount).toHaveBeenCalledWith('uri123')
      expect(NowPlaying.addTrack).toHaveBeenCalledWith({
        uri: '123'
      })
      expect(response).toEqual({
        uri: '123'
      })
    })
  })

  describe('event:volumeChanged', () => {
    test('returns the volume data passed in', async () => {
      const data = { volume: 99 }
      const mopidyMock = mock() as unknown
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
    test('returns the seek position', async () => {
      const data = { time_position: 99 }
      const mopidyMock = mock() as unknown
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
    test('returns the playback state data passed in', async () => {
      const data = { new_state: 'playing' }
      const mopidyMock = mock() as unknown
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
    test('removes the track from the recently played array returns the data passed in', async () => {
      const data = [
        {
          track: { uri: 'spotify:track:43xy5ZmjM9tdzmrXu1pmSG' }
        }
      ]
      const response = [{ name: 'track', artist: { name: 'artist' } }]
      expect.assertions(2)
      mockDecorateTracklist.mockResolvedValue(response)
      mockDatabase.settings.removeFromSeeds.mockResolvedValue(true)
      mockDatabase.tracks.addTracks.mockResolvedValue(true)
      const returnData = await MopidyDecorator.parse(h('tracklist.remove'), data)
      expect(returnData).toEqual({
        message: 'track by artist',
        toAll: true
      })
      expect(mockDatabase.settings.removeFromSeeds).toHaveBeenCalledWith(
        'spotify:track:43xy5ZmjM9tdzmrXu1pmSG'
      )
    })
  })

  describe('tracklist.clear', () => {
    test('returns the data passed in', async () => {
      expect.assertions(1)
      mockDatabase.settings.clearState.mockResolvedValue(true)
      const data = 'data'
      const returnData = await MopidyDecorator.parse(h('tracklist.clear'), data)
      return expect(returnData).toEqual(data)
    })
  })

  describe('mixer.getVolume', () => {
    test('returns the data passed in', async () => {
      expect.assertions(1)
      const data = 12
      const returnData = await MopidyDecorator.parse(h('mixer.getVolume'), data)
      return expect(returnData).toEqual({ volume: 12 })
    })
  })

  describe('mixer.setVolume', () => {
    test('returns the data passed in', async () => {
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
    test('returns the data passed in', async () => {
      expect.assertions(3)
      const data = [
        {
          track: {
            name: 'track',
            artist: { name: 'artist' }
          }
        },
        { track: { name: 'track1', artist: { name: 'artist2' } } }
      ]
      const headers = {
        key: 'tracklist.add',
        data: {
          uris: [
            'spotify:track:43xy5ZmjM9tdzmrXu1pmSG',
            'spotify:track:53xy5ZmjM9tdzmrXu1pmSG'
          ]
        },
        user: 'user'
      }
      mockDecorateTracklist.mockResolvedValue([data[0].track, data[1].track])
      mockDatabase.tracks.addTracks.mockResolvedValue(true)

      const returnData = await MopidyDecorator.parse(headers, data)
      expect(mockDatabase.tracks.addTracks).toHaveBeenCalledWith(
        ['spotify:track:43xy5ZmjM9tdzmrXu1pmSG', 'spotify:track:53xy5ZmjM9tdzmrXu1pmSG'],
        'user'
      )
      expect(DecorateTracklist).toHaveBeenCalledWith([data[0].track, data[1].track])
      expect(returnData).toEqual({
        message: 'track by artist, track1 by artist2',
        toAll: true
      })
    })
  })

  describe('playback.next', () => {
    test('returns null', async () => {
      expect.assertions(1)
      const returnData = await MopidyDecorator.parse(h('playback.next'), [])
      return expect(returnData).toBeNull()
    })
  })

  describe('playback.previous', () => {
    test('returns null', async () => {
      expect.assertions(1)
      const returnData = await MopidyDecorator.parse(h('playback.previous'), [])
      return expect(returnData).toBeNull()
    })
  })

  describe('when passing an unknown key into Transform.message', () => {
    test('returns with a skippedTransform message', async () => {
      expect.assertions(1)
      const data = 'data'
      const returnData = await MopidyDecorator.parse(h('unknown'), data)
      return expect(returnData).toEqual('skippedTransform: unknown')
    })
  })

  describe('when passing an unknown key into Transform.mopidyCoreMessage', () => {
    test('returns with a skippedTransform message', async () => {
      expect.assertions(1)
      const mopidyMock = mock() as unknown
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
