import ErrorsHandler from './index'

jest.useFakeTimers()

describe('ErrorsHandler', () => {
  const onMock = jest.fn()
  const ws = { on: onMock }

  beforeEach(() => {
    spyOn(console, 'log')
  })

  it('sets everything up before interval', () => {
    ErrorsHandler(ws)
    expect(onMock.mock.calls[0][1]).toEqual(expect.any(Function))
    expect(onMock.mock.calls[0][1]({ code: 'ECONNRESET' })).toBeUndefined()
    expect(function () {
      onMock.mock.calls[0][1]({ code: 'BANG' })
    }).toThrow()
  })
})
