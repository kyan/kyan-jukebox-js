import Mopidy from 'mopidy'
import MopidyService from '../../src/services/mopidy'
import logger from '../../src/config/logger'
import Decorator from '../../src/decorators/mopidy'
import EventLogger from '../../src/utils/event-logger'
import Setting, { updateTracklist } from '../../src/models/setting'
jest.mock('mopidy')
jest.mock('../../src/decorators/mopidy')
jest.mock('../../src/utils/event-logger')
jest.mock('../../src/config/logger')
jest.mock('../../src/models/setting')

const mockedDecorator = Decorator as jest.Mocked<typeof Decorator>
const mockedInitializeState = Setting.initializeState as jest.Mock
const mockedTrimTracklist = Setting.trimTracklist as jest.Mock
const mockedUpdateTracklist = updateTracklist as jest.Mock
const mockedClearState = Setting.clearState as jest.Mock
const mockedLogger = logger as jest.Mocked<typeof logger>
const mockedEventLogger = EventLogger as jest.Mocked<typeof EventLogger>

describe('MopidyService', () => {
  const broadcastMock = jest.fn()
  const mopidyStateMock = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('handles call the global events', () => {
    mockedDecorator.parse.mockResolvedValue('unifiedMessage')
    mockedDecorator.mopidyCoreMessage.mockResolvedValue('unifiedMopidyMessage')
    mockedInitializeState.mockResolvedValue(null)
    mockedTrimTracklist.mockResolvedValue(null)
    mockedUpdateTracklist.mockResolvedValue(null)

    MopidyService(broadcastMock, mopidyStateMock)

    const mockedMopidy = Mopidy as unknown
    const instance = (mockedMopidy as jest.Mock).mock.instances[0]
    instance.playback = {
      getCurrentTrack: jest
        .fn()
        .mockImplementationOnce(() => Promise.resolve({ uri: 'somemadeupuri' }))
        .mockImplementationOnce(() => Promise.resolve())
    }
    instance.tracklist = {
      getTracks: jest
        .fn()
        .mockImplementationOnce(() => Promise.resolve([{ uri: 'somemadeupuri' }]))
        .mockImplementationOnce(() => Promise.resolve([]))
        .mockImplementationOnce(() => Promise.resolve([{ uri: 'somemadeupuri' }]))
    }

    expect(instance.on.mock.calls[0][0]).toEqual('websocket:error')
    instance.on.mock.calls[0][1]({ message: 'boooooooom!' })
    expect(mockedLogger.error.mock.calls[0][0]).toEqual('Mopidy Error: boooooooom!')
    expect(Setting.clearState).toHaveBeenCalled()
    mockedClearState.mockClear()

    expect(instance.on.mock.calls[1][0]).toEqual('state:offline')
    instance.on.mock.calls[1][1]()
    expect(mockedLogger.info.mock.calls[0][0]).toEqual('Mopidy Offline')
    expect(mopidyStateMock.mock.calls[0][0]).toEqual({ online: false })
    expect(Setting.clearState).toHaveBeenCalled()

    expect(instance.on.mock.calls[2][0]).toEqual('state:online')
    instance.on.mock.calls[2][1]()
    instance.on.mock.calls[2][1]()
    expect(mockedLogger.info.mock.calls[1][0]).toEqual('Mopidy Online')

    expect(instance.on.mock.calls[3][0]).toEqual('event:trackPlaybackStarted')
    expect(instance.on.mock.calls[4][0]).toEqual('event:trackPlaybackEnded')
    expect(instance.on.mock.calls[5][0]).toEqual('event:playbackStateChanged')
    expect(instance.on.mock.calls[6][0]).toEqual('event:trackPlaybackResumed')

    expect(instance.on.mock.calls[7][0]).toEqual('event:tracklistChanged')
    instance.on.mock.calls[7][1]()

    expect(mockedEventLogger.info.mock.calls[0]).toEqual([
      'INCOMING MOPIDY [CORE]',
      { key: 'event:tracklistChanged', data: undefined }
    ])

    expect(instance.on.mock.calls[8][0]).toEqual('event:volumeChanged')
    instance.on.mock.calls[8][1]({ volume: '10' })
    expect(mockedEventLogger.info.mock.calls[1]).toEqual([
      'INCOMING MOPIDY [CORE]',
      { key: 'event:volumeChanged', data: { volume: '10' } }
    ])
  })
})
