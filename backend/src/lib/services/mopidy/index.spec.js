import MopidyService from './index'
import Mopidy from 'mopidy'
jest.mock('mopidy', () => {
  return function () {
    return {
      on: jest.fn((key, callback) => {
        callback()
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
    MopidyService(broadcaster, cb)
    expect(broadcastMock.mock.calls.length).toEqual(6)
    expect(broadcastMock.mock.calls[0][0]).toEqual('mopidy::connectionError')
    expect(broadcastMock.mock.calls[1][0]).toEqual('mopidy::event:trackPlaybackStarted')
    expect(broadcastMock.mock.calls[2][0]).toEqual('mopidy::event:playbackStateChanged')
    expect(broadcastMock.mock.calls[3][0]).toEqual('mopidy::event:trackPlaybackResumed')
    expect(broadcastMock.mock.calls[4][0]).toEqual('mopidy::event:tracklistChanged')
    expect(broadcastMock.mock.calls[5][0]).toEqual('mopidy::event:volumeChanged')
    expect(Mopidy).toEqual(expect.any(Function)) // to stop standardjs crying
  })
})
