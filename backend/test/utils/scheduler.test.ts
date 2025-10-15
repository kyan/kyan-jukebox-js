import { expect, test, describe, beforeEach, mock } from 'bun:test'
import Scheduler from '../../src/utils/scheduler'

// Mock the database factory
const mockDatabase = {
  settings: {
    getPlayedTracksFromTracklist: mock(() => Promise.resolve(['track1']))
  }
}

mock.module('../../src/services/database/factory', () => ({
  getDatabase: () => mockDatabase
}))

// Mock node-cron
const mockScheduledTask = {
  start: mock(() => {}),
  stop: mock(() => {}),
  destroy: mock(() => {}),
  getStatus: mock(() => 'scheduled')
}

const mockCronSchedule = mock(
  (_cronExpression: string, _func: () => void) => mockScheduledTask
)

mock.module('node-cron', () => ({
  default: {
    schedule: mockCronSchedule
  }
}))

// Mock logger
const mockLogger = {
  info: mock(() => {})
}

mock.module('../../src/config/logger', () => ({
  default: mockLogger
}))

describe('Scheduler', () => {
  const mopidyRemoveMock = mock(() => Promise.resolve(null))
  const mopidyStopMock = mock(() => Promise.resolve(null))

  beforeEach(() => {
    // Clear all mocks before each test
    mockCronSchedule.mockClear()
    mockScheduledTask.start.mockClear()
    mockLogger.info.mockClear()
    mopidyRemoveMock.mockClear()
    mopidyStopMock.mockClear()
    mockDatabase.settings.getPlayedTracksFromTracklist.mockClear()

    // Reset default mock values
    mockDatabase.settings.getPlayedTracksFromTracklist.mockResolvedValue(['track1'])
  })

  describe('scheduleAutoShutdown', () => {
    test('it should schedule a job to shutdown JB', async () => {
      const mopidy = {
        playback: {
          stop: mopidyStopMock
        },
        tracklist: {
          remove: mopidyRemoveMock
        }
      } as any

      Scheduler.scheduleAutoShutdown({
        mopidy,
        setting: mockDatabase.settings as any
      })

      // Verify that cron.schedule was called
      expect(mockCronSchedule).toHaveBeenCalledTimes(1)
      expect(mockCronSchedule).toHaveBeenCalledWith('0 19 * * *', expect.any(Function))

      // Verify that the scheduled task was started
      expect(mockScheduledTask.start).toHaveBeenCalledTimes(1)

      // Execute the scheduled function manually to test its behavior
      const scheduledFunction = mockCronSchedule.mock.calls[0]?.[1] as
        | (() => Promise<void>)
        | undefined
      if (scheduledFunction) {
        await scheduledFunction()
      }

      // Verify the scheduled function behavior
      expect(mopidyStopMock).toHaveBeenCalledTimes(1)
      expect(mopidyRemoveMock).toHaveBeenCalledTimes(1)
      expect(mopidyRemoveMock).toHaveBeenCalledWith({ criteria: { uri: ['track1'] } })
      expect(mockLogger.info).toHaveBeenCalledWith('[Scheduled] Jukebox Stopped')
    })

    test('it should not attempt to remove tracks if there are none', async () => {
      // Set up mock to return empty array
      mockDatabase.settings.getPlayedTracksFromTracklist.mockResolvedValue([])

      const mopidy = {
        playback: {
          stop: mopidyStopMock
        },
        tracklist: {
          remove: mopidyRemoveMock
        }
      } as any

      Scheduler.scheduleAutoShutdown({
        mopidy,
        setting: mockDatabase.settings as any
      })

      // Verify that cron.schedule was called
      expect(mockCronSchedule).toHaveBeenCalledTimes(1)
      expect(mockCronSchedule).toHaveBeenCalledWith('0 19 * * *', expect.any(Function))

      // Verify that the scheduled task was started
      expect(mockScheduledTask.start).toHaveBeenCalledTimes(1)

      // Execute the scheduled function manually to test its behavior
      const scheduledFunction = mockCronSchedule.mock.calls[0]?.[1] as
        | (() => Promise<void>)
        | undefined
      if (scheduledFunction) {
        await scheduledFunction()
      }

      // Verify the scheduled function behavior
      expect(mopidyStopMock).toHaveBeenCalledTimes(1)
      expect(mopidyRemoveMock).not.toHaveBeenCalled()
      expect(mockLogger.info).toHaveBeenCalledWith('[Scheduled] Jukebox Stopped')
    })
  })
})
