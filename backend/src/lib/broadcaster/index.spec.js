import broadcaster from './index'
import logger from '../../config/winston'
jest.mock('../../config/winston')

describe('Broadcaster', () => {
  describe('#to', () => {
    it('handles unauthorised call', () => {
      const sendMock = jest.fn()
      const clientMock = {
        id: '12345',
        emit: sendMock
      }
      const payload = {
        encoded_key: 'mopidy::playback.next'
      }
      const message = 'hello mum'

      broadcaster.to(clientMock, payload, message)
      expect(sendMock.mock.calls.length).toEqual(1)
      expect(sendMock.mock.calls[0][0]).toEqual('message')
      expect(sendMock.mock.calls[0][1])
        .toEqual('{"key":"mopidy::playback.next","data":"hello mum"}')
      expect(logger.info.mock.calls[0][0]).toEqual('Client')
      expect(logger.info.mock.calls[0][1]).toEqual({
        client: '12345',
        encodedKey: 'mopidy::playback.next',
        uid: 'public'
      })
    })

    it('handles authorised call', () => {
      const sendMock = jest.fn()
      const clientMock = {
        id: '12345',
        emit: sendMock
      }
      const payload = {
        user_id: '123456abcdefg',
        encoded_key: 'mopidy::playback.next'
      }
      const message = 'hello mum'

      broadcaster.to(clientMock, payload, message)
      expect(sendMock.mock.calls.length).toEqual(1)
      expect(sendMock.mock.calls[0][0]).toEqual('message')
      expect(sendMock.mock.calls[0][1])
        .toEqual('{"key":"mopidy::playback.next","data":"hello mum"}')
      expect(logger.info.mock.calls[0][0]).toEqual('Client')
      expect(logger.info.mock.calls[0][1]).toEqual({
        client: '12345',
        encodedKey: 'mopidy::playback.next',
        uid: '123456abcdefg'
      })
    })

    it('handles error', () => {
      const sendMock = jest.fn(() => { throw Error('oops') })
      const clientMock = {
        id: '12345',
        emit: sendMock
      }
      const payload = {
        user_id: '123456abcdefg',
        encoded_key: 'mopidy::playback.next'
      }
      const message = 'hello mum'

      broadcaster.to(clientMock, payload, message)
      expect(logger.error.mock.calls[0][0]).toEqual('Broadcast_to#')
      expect(logger.error.mock.calls[0][1]).toEqual({ message: 'oops' })
    })
  })
})
