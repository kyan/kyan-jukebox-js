import uuidv4 from 'uuid/v4'
import logger from '../../../config/winston'
import OrphansHandler from './index'
jest.mock('../../../config/winston')
jest.mock('uuid/v4', () => {
  return jest.fn().mockImplementation(() => {
    return '3f31ddf2-ab58-407c-8c28-d145eee55e9f'
  })
})
jest.useFakeTimers()

describe('OrphansHandler', () => {
  describe('ping', () => {
    let pingMock
    let dieMock
    let wss

    beforeEach(() => {
      pingMock = jest.fn()
      dieMock = jest.fn()
      wss = {
        clients: [{
          id: '12345',
          isAlive: false,
          ping: pingMock,
          terminate: dieMock
        }]
      }
    })

    it('handles when client is dead', () => {
      OrphansHandler.ping(wss)
      jest.runOnlyPendingTimers()
      expect(pingMock.mock.calls.length).toEqual(1)
      expect(pingMock.mock.calls[0][0]()).toBeUndefined()
      expect(dieMock.mock.calls.length).toEqual(1)
      expect(logger.info.mock.calls[0][0]).toEqual('Destroying orphan')
      expect(logger.info.mock.calls[0][1]).toEqual({ clientID: '12345' })
    })

    it('handles when client is alive', () => {
      wss.clients[0].isAlive = true
      OrphansHandler.ping(wss)
      jest.runOnlyPendingTimers()
      expect(pingMock.mock.calls.length).toEqual(1)
    })
  })

  describe('pong', () => {
    const pongMock = jest.fn()
    const ws = {
      on: pongMock,
      isAlive: false
    }

    it('handles the pong', () => {
      OrphansHandler.pong(ws)
      expect(uuidv4.mock.calls.length).toEqual(1)
      expect(logger.info.mock.calls[0][0]).toEqual('New client')
      expect(logger.info.mock.calls[0][1]).toEqual({
        clientID: '3f31ddf2-ab58-407c-8c28-d145eee55e9f'
      })
      expect(pongMock.mock.calls[0][0]).toEqual('pong')
      ws.isAlive = false
      pongMock.mock.calls[0][1]()
    })
  })
})
