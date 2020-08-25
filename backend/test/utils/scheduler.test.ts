import Scheduler from '../../src/utils/scheduler'
import logger from '../../src/config/logger'
import cron from 'node-cron'

describe('Scheduler', () => {
  const mockStop = jest.fn()
  const startMock = jest.fn()
  const infoMock = jest.fn()

  beforeAll(() => {
    jest.spyOn(cron, 'schedule').mockImplementation(() => {
      return {
        stop: jest.fn(),
        start: startMock,
        destroy: jest.fn(),
        getStatus: jest.fn()
      }
    })
    jest.spyOn(logger, 'info').mockImplementation(infoMock)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('scheduleAutoPlayback', () => {
    it('it should schedule two jobs, for 8am and 7pm', () => {
      const mockCronSchedule = cron.schedule as jest.Mock
      Scheduler.scheduleAutoPlayback({
        stop: mockStop
      })
      expect(cron.schedule).toHaveBeenCalledTimes(1)
      expect(startMock).toHaveBeenCalledTimes(1)
      expect(mockCronSchedule.mock.calls[0][0]).toEqual('0 19 * * *')
    })

    it('when the job is invoked it should stop the jukebox and call the logger', () => {
      const mockCronSchedule = cron.schedule as jest.Mock
      Scheduler.scheduleAutoPlayback({
        stop: mockStop
      })
      mockCronSchedule.mock.calls[0][1]()
      expect(mockStop).toHaveBeenCalledTimes(1)
      expect(infoMock).toHaveBeenCalledWith('[Scheduled] Jukebox Stopped')
    })
  })
})
