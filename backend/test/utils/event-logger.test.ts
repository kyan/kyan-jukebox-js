import EventLogger from '../../src/utils/event-logger'
import logger from '../../src/config/logger'
import { getDatabase } from '../../src/services/database/factory'

jest.mock('../../src/config/logger')
jest.mock('../../src/services/database/factory')

// Mock database service
const mockDatabase = {
  events: {
    create: jest.fn().mockReturnValue(Promise.resolve())
  }
}

const mockGetDatabase = getDatabase as jest.Mock
mockGetDatabase.mockReturnValue(mockDatabase)

describe('EventLogger', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('logs output but does not create an Event', () => {
    EventLogger.info('mopidy::mixer.setVolume', { data: { name: 'Duncan' } })
    expect(mockDatabase.events.create).not.toHaveBeenCalled()
    expect(logger.info).toHaveBeenCalledWith('mopidy::mixer.setVolume', {
      data: { name: 'Duncan' }
    })
  })

  it('logs output and creates an Event', () => {
    EventLogger.info(
      'mopidy::mixer.setVolume',
      { data: 'data', user: { _id: '12345' }, key: 'key123' },
      true
    )
    expect(mockDatabase.events.create).toHaveBeenCalledWith({
      key: 'key123',
      payload: {
        data: 'data',
        key: 'key123',
        response: undefined,
        user: {
          _id: '12345'
        }
      },
      user: '12345'
    })
    expect(logger.info).toHaveBeenCalledWith('mopidy::mixer.setVolume', {
      key: 'key123',
      user: { _id: '12345' },
      data: 'data'
    })
  })
})
