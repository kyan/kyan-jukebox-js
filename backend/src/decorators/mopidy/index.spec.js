import DecorateTrack from 'decorators/mopidy/track'
import DecorateTracklist from 'decorators/mopidy/tracklist'
import settings from 'utils/local-storage'
import Spotify from 'services/spotify'
import NowPlaying from 'handlers/now-playing'
import { addTracks, updateTrackPlaycount } from 'services/mongodb/models/track'
import trackListTrimmer from 'services/mopidy/tracklist-trimmer'
import MopidyDecorator from './index'

jest.mock('utils/local-storage')
jest.mock('services/spotify')
jest.mock('handlers/now-playing')
jest.mock('decorators/mopidy/track')
jest.mock('decorators/mopidy/tracklist')
jest.mock('services/mongodb/models/track')
jest.mock('services/mopidy/tracklist-trimmer')

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
      DecorateTracklist.mockResolvedValue([{ track: { uri: '123', length: 2820123 } }])
      return MopidyDecorator.parse(h('playback.getCurrentTrack'), data).then(() => {
        expect(DecorateTracklist).toHaveBeenCalledWith([data])
        expect(settings.setItem).toHaveBeenCalledWith(
          'track.current',
          '123'
        )
      })
    })

    it('does not transform when we have no data', () => {
      expect.assertions(1)
      return MopidyDecorator.parse(h('playback.getCurrentTrack'), null)
        .then(() => expect(DecorateTrack).not.toHaveBeenCalled())
    })
  })

  describe('playback.getTimePosition', () => {
    it('returns the data that was passed in', () => {
      const data = 'data'
      expect.assertions(1)
      return MopidyDecorator.parse(h('playback.getTimePosition'), data)
        .then(returnData => expect(returnData).toEqual(data))
    })
  })

  describe('tracklist.getTracks', () => {
    it('calls the DecorateTracklist class, passes it into the settings and returns the result', () => {
      const data = 'data'
      expect.assertions(3)
      DecorateTracklist.mockResolvedValue([{ track: { uri: '123', length: 2820123 } }])
      return MopidyDecorator.parse(h('tracklist.getTracks'), data).then((returnData) => {
        expect(DecorateTracklist).toHaveBeenCalledWith(data)
        expect(settings.setItem).toHaveBeenCalledWith('tracklist.current', ['123'])
        expect(returnData).toEqual([{ track: { uri: '123', length: 2820123 } }])
      })
    })
  })

  describe('event:trackPlaybackStarted', () => {
    it('does recommend if there are recomendations', () => {
      expect.assertions(6)
      const recomendMock = jest.fn()
      const data = { tl_track: { track: { uri: 'uri123' } } }
      const mopidyMock = jest.fn()
      updateTrackPlaycount.mockResolvedValue()
      DecorateTracklist.mockResolvedValue([{ track: { uri: '123', length: 2820123 } }])
      Spotify.canRecommend.mockResolvedValue('functionName')
      trackListTrimmer.mockResolvedValue()

      return MopidyDecorator.mopidyCoreMessage(h('event:trackPlaybackStarted'), data, mopidyMock).then((response) => {
        expect(updateTrackPlaycount).toHaveBeenCalledWith('uri123')
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
      expect.assertions(6)
      const data = { tl_track: { track: { uri: 'uri123' } } }
      const mopidyMock = jest.fn()
      updateTrackPlaycount.mockResolvedValue()
      DecorateTracklist.mockResolvedValue([{ track: { uri: '123' } }])
      Spotify.canRecommend.mockResolvedValue(null)

      return MopidyDecorator.mopidyCoreMessage(h('event:trackPlaybackStarted'), data, mopidyMock).then((response) => {
        expect(updateTrackPlaycount).toHaveBeenCalledWith('uri123')
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
      const data = 'data'
      return MopidyDecorator.mopidyCoreMessage(h('event:tracklistChanged'), data)
        .then(returnData => expect(returnData).toEqual(data))
    })
  })

  describe('event:volumeChanged', () => {
    it('returns the volume data passed in', () => {
      const data = { volume: 99 }
      expect.assertions(1)
      return MopidyDecorator.mopidyCoreMessage(h('event:volumeChanged'), data)
        .then(returnData => expect(returnData).toEqual(data.volume))
    })
  })

  describe('event:playbackStateChanged', () => {
    it('returns the playback state data passed in', () => {
      const data = { new_state: 'playing' }
      expect.assertions(1)
      return MopidyDecorator.mopidyCoreMessage(h('event:playbackStateChanged'), data)
        .then(returnData => expect(returnData).toEqual(data.new_state))
    })
  })

  describe('tracklist.remove', () => {
    it('removes the track from the revently played array returns the data passed in', () => {
      const data = [{
        track: { uri: 'spotify:track:43xy5ZmjM9tdzmrXu1pmSG' }
      }]
      expect.assertions(2)
      return MopidyDecorator.parse(h('tracklist.remove'), data).then(returnData => {
        expect(returnData).toEqual(data)
        expect(settings.removeFromArray.mock.calls[0])
          .toEqual(['tracklist.last_played', 'spotify:track:43xy5ZmjM9tdzmrXu1pmSG'])
      })
    })
  })

  describe('tracklist.clear', () => {
    it('returns the data passed in', () => {
      expect.assertions(1)
      const data = 'data'
      return MopidyDecorator.parse(h('tracklist.clear'), data)
        .then(returnData => expect(returnData).toEqual(data))
    })
  })

  describe('mixer.getVolume', () => {
    it('returns the data passed in', () => {
      expect.assertions(1)
      const data = 'data'
      return MopidyDecorator.parse(h('mixer.getVolume'), data)
        .then(returnData => expect(returnData).toEqual(data))
    })
  })

  describe('mixer.setVolume', () => {
    it('returns the data passed in', () => {
      expect.assertions(1)
      const data = 'data'
      return MopidyDecorator.parse(h('mixer.setVolume'), data)
        .then(returnData => expect(returnData).toEqual(data))
    })
  })

  describe('tracklist.add', () => {
    it('returns the data passed in', () => {
      expect.assertions(4)
      const data = [{ track: 'track' }]
      let headers = h('tracklist.add')
      headers.data = { uri: 'spotify:track:43xy5ZmjM9tdzmrXu1pmSG' }
      headers.user = 'user'
      DecorateTrack.mockResolvedValue('result')
      addTracks.mockResolvedValue()

      return MopidyDecorator.parse(headers, data)
        .then(returnData => {
          expect(addTracks).toHaveBeenCalledWith(['spotify:track:43xy5ZmjM9tdzmrXu1pmSG'], 'user')
          expect(DecorateTrack).toHaveBeenCalledWith('track')
          expect(returnData).toEqual('result')
          expect(DecorateTrack).toHaveBeenCalledWith(data[0].track)
        })
    })

    it('returns nothing if no data', () => {
      expect.assertions(3)
      const data = []
      let headers = h('tracklist.add')
      headers.data = { uri: 'spotify:track:43xy5ZmjM9tdzmrXu1pmSG' }
      headers.user = 'user'
      addTracks.mockResolvedValue()

      return MopidyDecorator.parse(headers, data)
        .then(returnData => {
          expect(addTracks).toHaveBeenCalledWith(['spotify:track:43xy5ZmjM9tdzmrXu1pmSG'], 'user')
          expect(DecorateTrack).not.toHaveBeenCalled()
          expect(returnData).toBeUndefined()
        })
    })
  })

  describe('playback.next', () => {
    it('returns a transformed track', () => {
      expect.assertions(1)
      const data = [{
        track: { uri: 'spotify:track:43xy5ZmjM9tdzmrXu1pmSG' }
      }]
      DecorateTrack.mockResolvedValue('result')

      return MopidyDecorator.parse(h('playback.next'), data)
        .then(returnData => expect(returnData).toEqual('result'))
    })

    it('returns null if no data', () => {
      expect.assertions(1)

      return MopidyDecorator.parse(h('playback.next'), [])
        .then(returnData => expect(returnData).toBeUndefined())
    })
  })

  describe('playback.previous', () => {
    it('returns a transformed track', () => {
      expect.assertions(1)
      const data = [{
        track: { uri: 'spotify:track:43xy5ZmjM9tdzmrXu1pmSG' }
      }]
      DecorateTrack.mockResolvedValue('result')

      return MopidyDecorator.parse(h('playback.previous'), data)
        .then(returnData => expect(returnData).toEqual('result'))
    })

    it('returns null if no data', () => {
      expect.assertions(1)
      return MopidyDecorator.parse(h('playback.previous'), [])
        .then(returnData => expect(returnData).toBeUndefined())
    })
  })

  describe('when passing an unknown key into Transform.message', () => {
    it('returns with a skippedTransform message', () => {
      expect.assertions(1)
      const data = 'data'
      return MopidyDecorator.parse(h('unknown'), data)
        .then(returnData => expect(returnData).toEqual('skippedTransform: unknown'))
    })
  })

  describe('when passing an unknown key into Transform.mopidyCoreMessage', () => {
    it('returns with a skippedTransform message', () => {
      expect.assertions(1)
      const data = 'data'
      return MopidyDecorator.mopidyCoreMessage(h('unknown'), data)
        .then(returnData => expect(returnData).toEqual('mopidySkippedTransform: unknown'))
    })
  })
})
