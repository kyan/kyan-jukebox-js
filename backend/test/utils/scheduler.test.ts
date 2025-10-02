import Scheduler from '../../src/utils/scheduler'
import cron from 'node-cron'
import Mopidy from 'mopidy'
import logger from '../../src/config/logger'
import { DBSettingStatics } from '../../src/models/setting'

describe('Scheduler', () => {
  const mopidyRemoveMock = jest.fn().mockResolvedValue(null)
  const mopidyStopMock = jest.fn().mockResolvedValue(null)
  const startMock = jest.fn()
  const infoMock = jest.fn()

  beforeAll(() => {
    jest.spyOn(cron, 'schedule').mockImplementation(() => {
      return {
        stop: jest.fn(),
        start: startMock,
        destroy: jest.fn(),
        getStatus: jest.fn()
      } as any
    })
    jest.spyOn(logger, 'info').mockImplementation(infoMock)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('scheduleAutoShutdown', () => {
    test('it should schedule a job to shutdown JB', () => {
      expect.assertions(7)
      const getPlayedTracksFromTracklistMock = jest.fn().mockResolvedValue(['track1'])
      const mopidy = {
        playback: {
          stop: mopidyStopMock
        },
        tracklist: {
          remove: mopidyRemoveMock
        }
      } as unknown
      const setting = {
        getPlayedTracksFromTracklist: getPlayedTracksFromTracklistMock
      } as unknown

      const mockCronSchedule = cron.schedule as jest.Mock

      Scheduler.scheduleAutoShutdown({
        mopidy: mopidy as Mopidy,
        setting: setting as DBSettingStatics
      })
      mockCronSchedule.mock.calls[0][1]()

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(mockCronSchedule).toHaveBeenCalledTimes(1)
          expect(mockCronSchedule).toHaveBeenCalledWith(
            '0 19 * * *',
            expect.any(Function)
          )
          expect(startMock).toHaveBeenCalledTimes(1)
          expect(mopidyStopMock).toHaveBeenCalledTimes(1)
          expect(mopidyRemoveMock).toHaveBeenCalledTimes(1)
          expect(mopidyRemoveMock).toHaveBeenCalledWith({ criteria: { uri: ['track1'] } })
          expect(infoMock).toHaveBeenCalledWith('[Scheduled] Jukebox Stopped')
          resolve()
        }, 0)
      })
    })

    test('it should not attempt to remove tracks if there are none', () => {
      expect.assertions(6)
      const getPlayedTracksFromTracklistMock = jest.fn().mockResolvedValue([])
      const mopidy = {
        playback: {
          stop: mopidyStopMock
        },
        tracklist: {
          remove: mopidyRemoveMock
        }
      } as unknown
      const setting = {
        getPlayedTracksFromTracklist: getPlayedTracksFromTracklistMock
      } as unknown

      const mockCronSchedule = cron.schedule as jest.Mock

      Scheduler.scheduleAutoShutdown({
        mopidy: mopidy as Mopidy,
        setting: setting as DBSettingStatics
      })
      mockCronSchedule.mock.calls[0][1]()

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(mockCronSchedule).toHaveBeenCalledTimes(1)
          expect(mockCronSchedule).toHaveBeenCalledWith(
            '0 19 * * *',
            expect.any(Function)
          )
          expect(startMock).toHaveBeenCalledTimes(1)
          expect(mopidyStopMock).toHaveBeenCalledTimes(1)
          expect(mopidyRemoveMock).not.toHaveBeenCalled()
          expect(infoMock).toHaveBeenCalledWith('[Scheduled] Jukebox Stopped')
          resolve()
        }, 0)
      })
    })
  })
})
