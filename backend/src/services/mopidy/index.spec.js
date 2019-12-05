import MopidyService from './index'
import Mopidy from 'mopidy'
import logger from 'config/winston'
import storage from 'utils/local-storage'
import EventLogger from 'utils/event-logger'
import Transformer from 'utils/transformer'
jest.mock('mopidy')
jest.mock('utils/event-logger')
jest.mock('utils/transformer')
jest.mock('utils/local-storage')
jest.mock('config/winston')
jest.mock('services/mopidy/tracklist-trimmer')

describe('MopidyService', () => {
  const broadcastMock = jest.fn()
  const mopidyStateMock = jest.fn()
  const allowConnectionMock = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('handles call the global events', () => {
    MopidyService(broadcastMock, mopidyStateMock, allowConnectionMock)

    const instance = Mopidy.mock.instances[0]
    instance.playback = {
      getCurrentTrack: jest.fn()
        .mockImplementationOnce(() => Promise.resolve({ uri: 'somemadeupuri' }))
        .mockImplementationOnce(() => Promise.resolve())
    }
    instance.tracklist = {
      getTracks: jest.fn()
        .mockImplementationOnce(() => Promise.resolve([{ uri: 'somemadeupuri' }]))
        .mockImplementationOnce(() => Promise.resolve([]))
        .mockImplementationOnce(() => Promise.resolve([{ uri: 'somemadeupuri' }]))
    }

    expect(instance.on.mock.calls[0][0]).toEqual('websocket:error')
    instance.on.mock.calls[0][1]({ message: 'boooooooom!' })
    expect(logger.error.mock.calls[0][0]).toEqual('Mopidy Error: boooooooom!')
    expect(storage.clearCurrent.mock.calls[0]).not.toBeUndefined()

    expect(instance.on.mock.calls[1][0]).toEqual('state:offline')
    instance.on.mock.calls[1][1]()
    expect(logger.info.mock.calls[0][0]).toEqual('Mopidy Offline')
    expect(mopidyStateMock.mock.calls[0][0]).toEqual(false)
    expect(storage.clearCurrent.mock.calls[1]).not.toBeUndefined()

    expect(instance.on.mock.calls[2][0]).toEqual('state:online')
    instance.on.mock.calls[2][1]()
    instance.on.mock.calls[2][1]()
    expect(logger.info.mock.calls[1][0]).toEqual('Mopidy Online')

    expect(instance.on.mock.calls[3][0]).toEqual('event:trackPlaybackStarted')
    expect(instance.on.mock.calls[4][0]).toEqual('event:playbackStateChanged')
    expect(instance.on.mock.calls[5][0]).toEqual('event:trackPlaybackResumed')

    expect(instance.on.mock.calls[6][0]).toEqual('event:tracklistChanged')
    instance.on.mock.calls[6][1]()

    expect(instance.on.mock.calls[7][0]).toEqual('event:volumeChanged')
    instance.on.mock.calls[7][1]({ volume: '10' })
    expect(EventLogger.mock.calls[0]).toEqual([
      { encoded_key: 'mopidy::event:volumeChanged' },
      null,
      '{"key":"mopidy::event:volumeChanged"}',
      'MopidyEvent'
    ])
    expect(Transformer.mock.calls[0][0]).toEqual('mopidy::event:volumeChanged')
    expect(Transformer.mock.calls[0][1]).toEqual({ volume: '10' })
    expect(Transformer.mock.calls[0][2]).toEqual(instance)
  })
})
