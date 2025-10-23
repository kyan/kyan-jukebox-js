import { Socket } from 'socket.io'
import logger from '../../src/config/logger'
import SocketErrorHandler from '../../src/handlers/socket-errors'
import { expect, test, describe, mock } from 'bun:test'

mock.module('../../src/config/logger', () => ({
  default: {
    info: mock(() => {}),
    error: mock(() => {}),
    warn: mock(() => {}),
    debug: mock(() => {})
  }
}))
// jest.useFakeTimers() - TODO: Convert to bun equivalent

const mockLoggerInfo = logger.info as any

describe('ErrorsHandler', () => {
  const onMock = mock()
  const ws = {
    id: '12345',
    on: onMock
  } as unknown

  test('sets everything up before interval', () => {
    SocketErrorHandler(ws as Socket)
    expect(onMock.mock.calls[0][0]).toEqual('error')
    expect(onMock.mock.calls[0][1]).toEqual(expect.any(Function))
    expect(onMock.mock.calls[0][1]({ code: 'ECONNRESET' })).toBeUndefined()
    expect(function () {
      onMock.mock.calls[0][1]({ code: 'BANG' })
    }).toThrow()
    expect(onMock.mock.calls[1][0]).toEqual('close')
    expect(onMock.mock.calls[1][1]).toEqual(expect.any(Function))
    onMock.mock.calls[1][1]()
    expect(mockLoggerInfo.mock.calls[0][0]).toEqual('Websocket closed')
    expect(mockLoggerInfo.mock.calls[0][1]).toEqual({ clientID: '12345' })
  })
})
