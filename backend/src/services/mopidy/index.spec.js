import MopidyService from './index'
import Mopidy from 'mopidy'
import logger from 'config/logger'
import Decorator from 'decorators/mopidy'
import EventLogger from 'utils/event-logger'
import {
  clearState,
  initializeState,
  trimTracklist,
  updateTracklist
} from 'services/mongodb/models/setting'
jest.mock('decorators/mopidy')
jest.mock('mopidy')
jest.mock('utils/event-logger')
jest.mock('config/logger')
jest.mock('services/mongodb/models/setting')

describe('MopidyService', () => {
  const broadcastMock = jest.fn()
  const mopidyStateMock = jest.fn()
  const allowConnectionMock = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('handles call the global events', () => {
    Decorator.parse.mockResolvedValue('unifiedMessage')
    Decorator.mopidyCoreMessage.mockResolvedValue('unifiedMopidyMessage')
    initializeState.mockResolvedValue()
    trimTracklist.mockResolvedValue()
    updateTracklist.mockResolvedValue()

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
    expect(clearState).toHaveBeenCalled()
    clearState.mockClear()

    expect(instance.on.mock.calls[1][0]).toEqual('state:offline')
    instance.on.mock.calls[1][1]()
    expect(logger.info.mock.calls[0][0]).toEqual('Mopidy Offline')
    expect(mopidyStateMock.mock.calls[0][0]).toEqual({ online: false })
    expect(clearState).toHaveBeenCalled()

    expect(instance.on.mock.calls[2][0]).toEqual('state:online')
    instance.on.mock.calls[2][1]()
    instance.on.mock.calls[2][1]()
    expect(logger.info.mock.calls[1][0]).toEqual('Mopidy Online')

    expect(instance.on.mock.calls[3][0]).toEqual('event:trackPlaybackStarted')
    expect(instance.on.mock.calls[4][0]).toEqual('event:trackPlaybackEnded')
    expect(instance.on.mock.calls[5][0]).toEqual('event:playbackStateChanged')
    expect(instance.on.mock.calls[6][0]).toEqual('event:trackPlaybackResumed')

    expect(instance.on.mock.calls[7][0]).toEqual('event:tracklistChanged')
    instance.on.mock.calls[7][1]()

    expect(EventLogger.info.mock.calls[0]).toEqual([
      'INCOMING MOPIDY [CORE]',
      { key: 'event:tracklistChanged', data: undefined }
    ])

    expect(instance.on.mock.calls[8][0]).toEqual('event:volumeChanged')
    instance.on.mock.calls[8][1]({ volume: '10' })
    expect(EventLogger.info.mock.calls[1]).toEqual([
      'INCOMING MOPIDY [CORE]',
      { key: 'event:volumeChanged', data: { volume: '10' } }
    ])
  })
})
