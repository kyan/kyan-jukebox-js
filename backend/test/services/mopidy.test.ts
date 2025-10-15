import { expect, test, describe, beforeEach, afterEach, mock } from 'bun:test'
import MopidyService from '../../src/services/mopidy'

// Mock Mopidy class
const mockOn = mock()
const mockGetCurrentTrack = mock(() => Promise.resolve(null))
const mockGetTracks = mock(() => Promise.resolve([]))

const mockMopidy = {
  on: mockOn,
  playback: {
    getCurrentTrack: mockGetCurrentTrack
  },
  tracklist: {
    getTracks: mockGetTracks
  }
}

// Mock database methods
const mockInitializeState = mock(() => Promise.resolve())
const mockTrimTracklist = mock(() => Promise.resolve())
const mockClearState = mock(() => Promise.resolve())
const mockUpdateTracklist = mock(() => Promise.resolve())

// Mock external modules
mock.module('mopidy', () => ({
  default: class MockMopidy {
    constructor() {
      return mockMopidy
    }
  }
}))

mock.module('../../src/services/database/factory', () => ({
  getDatabase: () => ({
    settings: {
      initializeState: mockInitializeState,
      trimTracklist: mockTrimTracklist,
      clearState: mockClearState,
      updateTracklist: mockUpdateTracklist
    }
  })
}))

mock.module('../../src/decorators/mopidy', () => ({
  default: {
    parse: mock(() => Promise.resolve({ type: 'parsed', message: 'test' })),
    mopidyCoreMessage: mock(() => Promise.resolve({ type: 'core', message: 'test' }))
  }
}))

mock.module('../../src/utils/event-logger', () => ({
  default: {
    info: mock()
  }
}))

mock.module('../../src/config/logger', () => ({
  default: {
    error: mock(),
    info: mock()
  }
}))

mock.module('../../src/constants/mopidy', () => ({
  default: {
    CORE_EVENTS: {
      TRACKLIST_CHANGED: 'event:tracklistChanged',
      TRACK_PLAYBACK_STARTED: 'event:trackPlaybackStarted'
    },
    GET_TRACKS: 'tracklist.getTracks'
  }
}))

mock.module('../../src/constants/message', () => ({
  default: {
    INCOMING_CORE: 'INCOMING_CORE'
  }
}))

describe('MopidyService', () => {
  const mockBroadcastToAll = mock()
  const mockBroadcastStateChange = mock()

  beforeEach(() => {
    mock.clearAllMocks()
    process.env.WS_MOPIDY_URL = 'localhost'
    process.env.WS_MOPIDY_PORT = '6680'
  })

  afterEach(() => {
    mock.restore()
  })

  describe('initialization', () => {
    test('should create Mopidy instance and register event listeners', () => {
      MopidyService(mockBroadcastToAll, mockBroadcastStateChange)

      // Verify basic event listeners are registered
      expect(mockOn).toHaveBeenCalledWith('websocket:error', expect.any(Function))
      expect(mockOn).toHaveBeenCalledWith('state:offline', expect.any(Function))
      expect(mockOn).toHaveBeenCalledWith('state:online', expect.any(Function))
      expect(mockOn).toHaveBeenCalledWith('event:tracklistChanged', expect.any(Function))
      expect(mockOn).toHaveBeenCalledWith(
        'event:trackPlaybackStarted',
        expect.any(Function)
      )
    })

    test('should use environment variables for configuration', () => {
      process.env.WS_MOPIDY_URL = 'test-host'
      process.env.WS_MOPIDY_PORT = '1234'

      expect(() => {
        MopidyService(mockBroadcastToAll, mockBroadcastStateChange)
      }).not.toThrow()

      expect(mockOn).toHaveBeenCalled()
    })
  })

  describe('event handler setup', () => {
    test('should register all required event handlers', () => {
      MopidyService(mockBroadcastToAll, mockBroadcastStateChange)

      const registeredEvents = mockOn.mock.calls.map((call) => call[0])

      expect(registeredEvents).toContain('websocket:error')
      expect(registeredEvents).toContain('state:offline')
      expect(registeredEvents).toContain('state:online')
      expect(registeredEvents).toContain('event:tracklistChanged')
      expect(registeredEvents).toContain('event:trackPlaybackStarted')
    })

    test('should pass function handlers to event registration', () => {
      MopidyService(mockBroadcastToAll, mockBroadcastStateChange)

      // All handlers should be functions
      mockOn.mock.calls.forEach((call) => {
        expect(call[1]).toBeInstanceOf(Function)
      })
    })
  })

  describe('service factory pattern', () => {
    test('should return a promise', () => {
      const result = MopidyService(mockBroadcastToAll, mockBroadcastStateChange)
      expect(result).toBeInstanceOf(Promise)
    })

    test('should accept broadcast functions as parameters', () => {
      expect(() => {
        MopidyService(mockBroadcastToAll, mockBroadcastStateChange)
      }).not.toThrow()
    })
  })

  describe('error handling', () => {
    test('should handle missing environment variables gracefully', () => {
      delete process.env.WS_MOPIDY_URL
      delete process.env.WS_MOPIDY_PORT

      expect(() => {
        MopidyService(mockBroadcastToAll, mockBroadcastStateChange)
      }).not.toThrow()
    })

    test('should register error event handler', () => {
      MopidyService(mockBroadcastToAll, mockBroadcastStateChange)

      const errorHandler = mockOn.mock.calls.find((call) => call[0] === 'websocket:error')
      expect(errorHandler).toBeDefined()
      expect(errorHandler[1]).toBeInstanceOf(Function)
    })
  })

  describe('event simulation', () => {
    test('should handle state:offline event without crashing', () => {
      MopidyService(mockBroadcastToAll, mockBroadcastStateChange)

      const offlineHandler = mockOn.mock.calls.find(
        (call) => call[0] === 'state:offline'
      )?.[1]

      expect(() => {
        offlineHandler?.()
      }).not.toThrow()
    })

    test('should handle websocket:error event without crashing', () => {
      MopidyService(mockBroadcastToAll, mockBroadcastStateChange)

      const errorHandler = mockOn.mock.calls.find(
        (call) => call[0] === 'websocket:error'
      )?.[1]

      expect(() => {
        errorHandler?.({ message: 'Test error' })
      }).not.toThrow()
    })
  })

  describe('integration points', () => {
    test('should work with different broadcast functions', () => {
      const customBroadcastToAll = mock()
      const customBroadcastStateChange = mock()

      expect(() => {
        MopidyService(customBroadcastToAll, customBroadcastStateChange)
      }).not.toThrow()

      expect(mockOn).toHaveBeenCalled()
    })

    test('should setup core event listeners for Mopidy events', () => {
      MopidyService(mockBroadcastToAll, mockBroadcastStateChange)

      const coreEvents = mockOn.mock.calls
        .map((call) => call[0])
        .filter((event) => event.startsWith('event:'))

      expect(coreEvents.length).toBeGreaterThan(0)
      expect(coreEvents).toContain('event:tracklistChanged')
      expect(coreEvents).toContain('event:trackPlaybackStarted')
    })
  })
})
