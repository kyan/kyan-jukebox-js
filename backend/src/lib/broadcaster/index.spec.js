import Broadcaster from './index'

describe('Broadcaster', () => {
  const mockBroadcaster = jest.fn()
  const broadcaster = new Broadcaster(mockBroadcaster)

  beforeEach(() => {
    spyOn(console, 'log')
  })

  describe('#to', () => {
    it('handles unauthorised call', () => {
      const sendMock = jest.fn()
      const clientMock = { send: sendMock }
      const payload = {
        encoded_key: 'mopidy::playback.next'
      }
      const message = 'hello mum'

      broadcaster.to(clientMock, payload, message)
      expect(console.log).toBeCalledWith('[c][public]: mopidy::playback.next')
      expect(sendMock.mock.calls.length).toEqual(1)
      expect(sendMock.mock.calls[0][0])
        .toEqual('{"key":"mopidy::playback.next","data":"hello mum"}')
    })

    it('handles authorised call', () => {
      const sendMock = jest.fn()
      const clientMock = { send: sendMock }
      const payload = {
        user_id: '123456abcdefg',
        encoded_key: 'mopidy::playback.next'
      }
      const message = 'hello mum'

      broadcaster.to(clientMock, payload, message)
      expect(console.log).toBeCalledWith('[c][123456abcdefg]: mopidy::playback.next')
      expect(sendMock.mock.calls.length).toEqual(1)
      expect(sendMock.mock.calls[0][0])
        .toEqual('{"key":"mopidy::playback.next","data":"hello mum"}')
    })
  })

  describe('#everyone', () => {
    it('handles the call', () => {
      const key = 'mopidy::playback.next'
      const message = 'hello mum'

      broadcaster.everyone(key, message)
      expect(console.log).toBeCalledWith('[a]: mopidy::playback.next')
      expect(mockBroadcaster.mock.calls.length).toEqual(1)
      expect(mockBroadcaster.mock.calls[0][0])
        .toEqual('{"key":"mopidy::playback.next","data":"hello mum"}')
    })
  })
})
