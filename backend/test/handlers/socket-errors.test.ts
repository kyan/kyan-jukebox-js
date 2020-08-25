import logger from '../../src/config/logger'
import ErrorsHandler from '../../src/handlers/socket-errors'
jest.mock('../../src/config/logger')
jest.useFakeTimers()

const mockLoggerInfo = logger.info as jest.Mock

describe('ErrorsHandler', () => {
  const onMock = jest.fn()
  const ws = {
    id: '12345',
    on: onMock
  } as unknown

  it('sets everything up before interval', () => {
    ErrorsHandler(ws as SocketIO.Socket)
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
