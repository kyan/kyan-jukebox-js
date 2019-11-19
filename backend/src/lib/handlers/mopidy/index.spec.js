import logger from '../../../config/winston'
import MopidyHandler from './index'
import ImageCache from './image-cache'
import Spotify from '../../services/spotify'
jest.mock('./image-cache')
jest.mock('../../../config/winston')
jest.mock('../../services/spotify')
jest.mock('../../services/mopidy/tracklist-trimmer')

describe('MopidyHandler', () => {
  let payload = {
    encoded_key: 'mopidy::playback.stop',
    key: 'playback.stop',
    service: 'mopidy',
    data: [['12345zsdf23456']]
  }
  const ws = 'websocket'
  const successMock = () => {
    return {
      then: (success, _) => {
        return success('response')
      }
    }
  }
  const failMock = () => {
    return {
      then: (_, failure) => {
        return failure('error')
      }
    }
  }
  const noResponseMock = () => {
    return {
      then: (success, _) => {
        return success()
      }
    }
  }
  const broadcastMock = jest.fn()
  const broadcasterMock = {
    to: broadcastMock
  }
  const addToCacheMock = jest.fn()

  afterEach(() => {
    ImageCache.check.mockClear()
    broadcastMock.mockClear()
  })

  describe('ImageCache', () => {
    it('Should be called with the correct params', () => {
      const mopidy = { playback: { stop: successMock } }
      MopidyHandler(payload, ws, broadcasterMock, mopidy)
      expect(ImageCache.check.mock.calls.length).toEqual(1)
      expect(ImageCache.check.mock.calls[0][0]).toEqual(payload.encoded_key)
      expect(ImageCache.check.mock.calls[0][1]).toEqual(payload.data)
      expect(ImageCache.check.mock.calls[0][2]).toEqual(jasmine.any(Function))
    })

    it('should handle errors passed back', () => {
      const mopidy = { playback: { stop: successMock } }
      MopidyHandler(payload, ws, broadcasterMock, mopidy)
      expect(function () {
        ImageCache.check.mock.calls[0][2]('bang!', null)
      }).toThrow()
    })

    it('should handle image passed back', () => {
      const mopidy = { playback: { stop: successMock } }
      MopidyHandler(payload, ws, broadcasterMock, mopidy)
      ImageCache.check.mock.calls[0][2](null, { image: 'img' })
      expect(broadcastMock.mock.calls.length).toEqual(1)
      expect(broadcastMock.mock.calls.length).toEqual(1)
      expect(broadcastMock.mock.calls[0][0]).toEqual('websocket')
      expect(broadcastMock.mock.calls[0][1]).toEqual(payload)
      expect(broadcastMock.mock.calls[0][2]).toEqual('img')
      broadcastMock.mockClear()
    })

    it('should handle addToCacheMock passed back', () => {
      const mopidy = { playback: { stop: successMock } }
      MopidyHandler(payload, ws, broadcasterMock, mopidy)
      ImageCache.check.mock.calls[0][2](null, { addToCache: addToCacheMock })
      expect(broadcastMock.mock.calls.length).toEqual(1)
      expect(broadcastMock.mock.calls[0][0]).toEqual('websocket')
      expect(broadcastMock.mock.calls[0][1]).toEqual(payload)
      expect(broadcastMock.mock.calls[0][2]).toEqual('response')
      expect(addToCacheMock.mock.calls.length).toEqual(1)
      expect(addToCacheMock.mock.calls[0][0]).toEqual('response')
    })

    it('should handle api call without params', () => {
      const mopidy = { playback: { stop: successMock } }
      MopidyHandler({ key: payload.key }, ws, broadcasterMock, mopidy)
      ImageCache.check.mock.calls[0][2](null, {})
      expect(broadcastMock.mock.calls.length).toEqual(1)
    })

    it('should handle api call with params', () => {
      const mopidy = { playback: { stop: successMock } }
      MopidyHandler({
        key: payload.key,
        data: payload.data
      }, ws, broadcasterMock, mopidy)
      ImageCache.check.mock.calls[0][2](null, { addToCache: addToCacheMock })
      expect(broadcastMock.mock.calls.length).toEqual(1)
    })

    it('should handle api call that errors', () => {
      const mopidy = { playback: { stop: failMock } }
      MopidyHandler({ key: payload.key }, ws, broadcasterMock, mopidy)
      ImageCache.check.mock.calls[0][2](null, {})
      expect(broadcastMock.mock.calls.length).toEqual(0)
      expect(logger.error.mock.calls).toEqual([['failureHandler: ', { key: 'playback.stop' }]])
    })

    it('should handle api call with no response', () => {
      const mopidy = { playback: { stop: noResponseMock } }
      MopidyHandler({ key: payload.key }, ws, broadcasterMock, mopidy)
      ImageCache.check.mock.calls[0][2](null, {})
      expect(broadcastMock.mock.calls).toEqual([['websocket', { key: 'playback.stop' }, undefined]])
    })

    it('should handle add track call', () => {
      const payload = {
        encoded_key: 'mopidy::tracklist.add',
        key: 'tracklist.add',
        service: 'mopidy',
        data: { uri: 'track123' }
      }
      MopidyHandler(payload, ws, broadcasterMock, {})
      expect(Spotify.validateTrack.mock.calls).toEqual([['track123', expect.any(Function)]])
    })
  })
})
