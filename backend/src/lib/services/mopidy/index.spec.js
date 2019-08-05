import MopidyService from './index'
import Mopidy from 'mopidy'
import logger from '../../../config/winston'

jest.mock('../../../lib/transformer')
jest.mock('../../../config/winston')
jest.mock('mopidy', () => {
  return function () {
    return {
      on: jest.fn((key, fn) => {
        fn({ message: 'bang!' })
      })
    }
  }
})

describe('MopidyService', () => {
  const sendMock = jest.fn()
  const socketIO = {
    send: sendMock
  }
  const cb = jest.fn()

  it('it should handle going online', () => {
    spyOn(process, 'exit')
    MopidyService(socketIO, cb)
    expect(sendMock.mock.calls.length).toEqual(5)
    expect(sendMock.mock.calls[0][0]).toEqual('{"key":"mopidy::event:trackPlaybackStarted"}')
    expect(sendMock.mock.calls[1][0]).toEqual('{"key":"mopidy::event:playbackStateChanged"}')
    expect(sendMock.mock.calls[2][0]).toEqual('{"key":"mopidy::event:trackPlaybackResumed"}')
    expect(sendMock.mock.calls[3][0]).toEqual('{"key":"mopidy::event:tracklistChanged"}')
    expect(sendMock.mock.calls[4][0]).toEqual('{"key":"mopidy::event:volumeChanged"}')
    expect(Mopidy).toEqual(expect.any(Function)) // to stop standardjs crying
    expect(logger.info.mock.calls[0][0]).toEqual('Mopidy Offline')
    expect(logger.info.mock.calls[0][1]).toEqual({ url: 'mopidy-prod.local:6680' })
    expect(logger.error.mock.calls[0][0]).toEqual('Mopidy Error: bang!')
    expect(logger.error.mock.calls[0][1]).toEqual({ url: 'mopidy-prod.local:6680' })
  })
})
