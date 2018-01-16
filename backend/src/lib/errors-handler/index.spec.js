import ErrorsHandler from './index'

jest.useFakeTimers()

describe('ErrorsHandler', () => {
  const onMock = jest.fn()
  const ws = { on: onMock }

  it('sets everything up before interval', () => {
    const terminateMock = jest.fn()
    const pingMock = jest.fn()
    const wss = {
      clients: [{
        isAlive: true,
        terminate: terminateMock,
        ping: pingMock
      }]
    }

    ErrorsHandler(ws, wss)
    expect(setInterval).toHaveBeenCalledTimes(1)
    expect(setInterval).toHaveBeenCalledWith(
      expect.any(Function),
      30000
    )
    expect(ws.isAlive).toEqual(true)
    expect(onMock.mock.calls[0][0]).toEqual('pong')
    expect(onMock.mock.calls[0][1]).toEqual(expect.any(Function))
    let heartbeat = {}
    onMock.mock.calls[0][1].call(heartbeat)
    expect(heartbeat.isAlive).toEqual(true)
    expect(onMock.mock.calls[1][0]).toEqual('error')
    expect(onMock.mock.calls[1][1]).toEqual(expect.any(Function))
    expect(onMock.mock.calls[1][1]({ code: 'ECONNRESET' })).toBeUndefined()
    expect(function () {
      onMock.mock.calls[1][1]({ code: 'BANG' })
    }).toThrow()
  })

  describe('when isAlive is false', () => {
    const terminateMock = jest.fn()
    const pingMock = jest.fn()
    const wss = {
      clients: [{
        isAlive: false,
        terminate: terminateMock,
        ping: pingMock
      }]
    }

    it('terminates client if alive false', () => {
      ErrorsHandler(ws, wss)
      jest.runOnlyPendingTimers()
      expect(terminateMock.mock.calls.length).toEqual(1)
      expect(pingMock.mock.calls.length).toEqual(0)
    })
  })

  describe('when isAlive is true', () => {
    const terminateMock = jest.fn()
    const pingMock = jest.fn()
    const wss = {
      clients: [{
        isAlive: true,
        terminate: terminateMock,
        ping: pingMock.mockReturnThis()
      }]
    }

    it('handles when alive is true', () => {
      ErrorsHandler(ws, wss)
      jest.runOnlyPendingTimers()
      expect(terminateMock.mock.calls.length).toEqual(0)
      expect(pingMock.mock.calls.length).toEqual(1)
      expect(pingMock.mock.calls[0][0].call()).toBeUndefined()
    })
  })
})
