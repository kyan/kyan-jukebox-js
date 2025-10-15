import { expect, test, afterEach, describe, mock } from 'bun:test'
import EventLogger from '../../src/utils/event-logger'
import logger from '../../src/config/logger'

// Mock logger
mock.module('../../src/config/logger', () => ({
  default: {
    info: mock(() => {}),
    error: mock(() => {}),
    warn: mock(() => {}),
    debug: mock(() => {})
  }
}))

// Mock database service
const mockDatabase = {
  events: {
    create: mock().mockReturnValue(Promise.resolve())
  }
}

// Mock the database factory
mock.module('../../src/services/database/factory', () => ({
  getDatabase: mock(() => mockDatabase)
}))

describe('EventLogger', () => {
  afterEach(() => {
    mockDatabase.events.create.mockClear()
    ;(logger.info as any).mockClear()
  })

  test('logs output but does not create an Event', () => {
    EventLogger.info('mopidy::mixer.setVolume', { data: { name: 'Duncan' } })
    expect(mockDatabase.events.create).not.toHaveBeenCalled()
    expect(logger.info).toHaveBeenCalledWith('mopidy::mixer.setVolume', {
      data: { name: 'Duncan' }
    })
  })

  test('logs output and creates an Event', () => {
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
