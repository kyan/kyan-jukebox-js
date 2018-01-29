import MopidyHandler from './index'
import ImageCache from './image-cache'
jest.mock('./image-cache')

describe('MopidyHandler', () => {
  let payload = {
    key: 'mopidy::playback.stop',
    data: [['12345zsdf23456']]
  }
  const ws = 'websocket'
  const stopMock = params => {
    return {
      then: (cb) => {
        cb(params)
        return {
          catch: () => {
            return {
              done: jest.fn()
            }
          }
        }
      }
    }
  }
  const broadcastMock = jest.fn()
  const broadcasterMock = {
    to: broadcastMock
  }
  const mopidy = { playback: { stop: stopMock } }
  const addToCacheMock = jest.fn()

  afterEach(() => {
    ImageCache.check.mockClear()
    broadcastMock.mockClear()
  })

  describe('ImageCache', () => {
    it('Should be called with the correct params', () => {
      MopidyHandler(JSON.stringify(payload), ws, broadcasterMock, mopidy)
      expect(ImageCache.check.mock.calls.length).toEqual(1)
      expect(ImageCache.check.mock.calls[0][0]).toEqual(payload.key)
      expect(ImageCache.check.mock.calls[0][1]).toEqual(payload.data)
      expect(ImageCache.check.mock.calls[0][2]).toEqual(jasmine.any(Function))
    })

    it('should handle errors passed back', () => {
      MopidyHandler(JSON.stringify(payload), ws, broadcasterMock, mopidy)
      expect(function () {
        ImageCache.check.mock.calls[0][2]('bang!', null)
      }).toThrow()
    })

    it('should handle image passed back', () => {
      MopidyHandler(JSON.stringify(payload), ws, broadcasterMock, mopidy)
      ImageCache.check.mock.calls[0][2](null, { image: 'img' })
      expect(broadcastMock.mock.calls.length).toEqual(1)
      expect(broadcastMock.mock.calls.length).toEqual(1)
      expect(broadcastMock.mock.calls[0][0]).toEqual('websocket')
      expect(broadcastMock.mock.calls[0][1]).toEqual('mopidy::playback.stop')
      expect(broadcastMock.mock.calls[0][2]).toEqual('img')
      broadcastMock.mockClear()
    })

    it('should handle addToCacheMock passed back', () => {
      MopidyHandler(JSON.stringify(payload), ws, broadcasterMock, mopidy)
      ImageCache.check.mock.calls[0][2](null, { addToCache: addToCacheMock })
      expect(broadcastMock.mock.calls.length).toEqual(1)
      expect(broadcastMock.mock.calls[0][0]).toEqual('websocket')
      expect(broadcastMock.mock.calls[0][1]).toEqual('mopidy::playback.stop')
      expect(broadcastMock.mock.calls[0][2]).toEqual([['12345zsdf23456']])
      expect(addToCacheMock.mock.calls.length).toEqual(1)
      expect(addToCacheMock.mock.calls[0][0]).toEqual([['12345zsdf23456']])
    })

    it('should handle api call without params', () => {
      MopidyHandler(JSON.stringify({
        key: payload.key
      }), ws, broadcasterMock, mopidy)
      ImageCache.check.mock.calls[0][2](null, {})
      expect(broadcastMock.mock.calls.length).toEqual(1)
    })

    it('should handle api call with params', () => {
      MopidyHandler(JSON.stringify({
        key: payload.key,
        data: payload.data
      }), ws, broadcasterMock, mopidy)
      ImageCache.check.mock.calls[0][2](null, { addToCache: addToCacheMock })
      expect(broadcastMock.mock.calls.length).toEqual(1)
    })
  })
})
