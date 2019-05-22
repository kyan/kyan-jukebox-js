import MopidyService from './index'
import Mopidy from 'mopidy'
import logger from '../../../config/winston'
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
  const broadcastMock = jest.fn()
  const broadcaster = {
    everyone: broadcastMock
  }
  const cb = jest.fn()

  it('it should handle going online', () => {
    spyOn(process, 'exit')
    MopidyService(broadcaster, cb)
    expect(broadcastMock.mock.calls.length).toEqual(5)
    expect(broadcastMock.mock.calls[0][0]).toEqual('mopidy::event:trackPlaybackStarted')
    expect(broadcastMock.mock.calls[1][0]).toEqual('mopidy::event:playbackStateChanged')
    expect(broadcastMock.mock.calls[2][0]).toEqual('mopidy::event:trackPlaybackResumed')
    expect(broadcastMock.mock.calls[3][0]).toEqual('mopidy::event:tracklistChanged')
    expect(broadcastMock.mock.calls[4][0]).toEqual('mopidy::event:volumeChanged')
    expect(Mopidy).toEqual(expect.any(Function)) // to stop standardjs crying
    expect(logger.info.mock.calls[0][0]).toEqual('Mopidy Online')
    expect(logger.info.mock.calls[0][1]).toEqual({ url: 'mopidy-prod.local:6680' })
    expect(logger.error.mock.calls[0][0]).toEqual('Mopidy Error: bang!')
    expect(logger.error.mock.calls[0][1]).toEqual({ url: 'mopidy-prod.local:6680' })
  })
})
