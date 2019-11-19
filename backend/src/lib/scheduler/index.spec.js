import Scheduler from './index'
import logger from '../../config/winston'
const cron = require('node-cron')

describe('Scheduler', () => {
  const mockStop = jest.fn()
  const startMock = jest.fn()
  const infoMock = jest.fn()

  beforeAll(() => {
    jest.spyOn(cron, 'schedule').mockImplementation(() => {
      return {
        start: startMock
      }
    })
    jest.spyOn(logger, 'info').mockImplementation(infoMock)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('scheduleAutoPlayback', () => {
    it('it should schedule two jobs, for 8am and 7pm', () => {
      Scheduler.scheduleAutoPlayback({
        stop: mockStop
      })
      expect(cron.schedule).toHaveBeenCalledTimes(1)
      expect(startMock).toHaveBeenCalledTimes(1)
      expect(cron.schedule.mock.calls[0][0]).toEqual('0 19 * * *')
    })

    it('when the job is invoked it should stop the jukebox and call the logger', () => {
      Scheduler.scheduleAutoPlayback({
        stop: mockStop
      })
      cron.schedule.mock.calls[0][1]()
      expect(mockStop).toHaveBeenCalledTimes(1)
      expect(infoMock).toHaveBeenCalledWith('[Scheduled] Jukebox Stopped')
    })
  })
})
