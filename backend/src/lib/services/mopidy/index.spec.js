import MopidyService from './index'
import Mopidy from 'mopidy'
import logger from '../../../config/winston'
import storage from '../../local-storage'
import EventLogger from '../../../lib/event-logger'
import Transformer from '../../transformer'
jest.mock('mopidy')
jest.mock('../../../lib/event-logger')
jest.mock('../../transformer')
jest.mock('../../local-storage')
jest.mock('../../../config/winston')
jest.mock('../../services/mopidy/tracklist-trimmer')

describe('MopidyService', () => {
  const wss = { send: jest.fn() }
  const callbackMock = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('handles call the global events', () => {
    MopidyService(wss, callbackMock)

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
        .mockImplementationOnce(() => Promise.resolve('calledaftertracklistchanjged'))
    }

    expect(instance.on.mock.calls[0][0]).toEqual('websocket:error')
    instance.on.mock.calls[0][1]({ message: 'boooooooom!' })
    expect(logger.error.mock.calls[0][0]).toEqual('Mopidy Error: boooooooom!')
    expect(storage.clearCurrent).toBeCalled()

    expect(instance.on.mock.calls[1][0]).toEqual('state:offline')
    instance.on.mock.calls[1][1]()
    expect(logger.info.mock.calls[0][0]).toEqual('Mopidy Offline')
    expect(storage.clearCurrent).toBeCalled()

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
      { volume: '10' },
      'MopidyEvent'
    ])
    expect(Transformer.mock.calls[0][0]).toEqual('mopidy::event:volumeChanged')
    expect(Transformer.mock.calls[0][1]).toEqual({ volume: '10' })
    expect(Transformer.mock.calls[0][2]).toEqual(instance)
  })
})
