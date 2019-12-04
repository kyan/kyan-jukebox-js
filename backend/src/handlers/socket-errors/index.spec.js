import logger from 'config/winston'
import ErrorsHandler from './index'
jest.mock('config/winston')

jest.useFakeTimers()

describe('ErrorsHandler', () => {
  const onMock = jest.fn()
  const ws = {
    id: '12345',
    on: onMock
  }

  it('sets everything up before interval', () => {
    ErrorsHandler(ws)
    expect(onMock.mock.calls[0][0]).toEqual('error')
    expect(onMock.mock.calls[0][1]).toEqual(expect.any(Function))
    expect(onMock.mock.calls[0][1]({ code: 'ECONNRESET' })).toBeUndefined()
    expect(function () {
      onMock.mock.calls[0][1]({ code: 'BANG' })
    }).toThrow()
    expect(onMock.mock.calls[1][0]).toEqual('close')
    expect(onMock.mock.calls[1][1]).toEqual(expect.any(Function))
    onMock.mock.calls[1][1]()
    expect(logger.info.mock.calls[0][0]).toEqual('Websocket closed')
    expect(logger.info.mock.calls[0][1]).toEqual({ clientID: '12345' })
  })
})
