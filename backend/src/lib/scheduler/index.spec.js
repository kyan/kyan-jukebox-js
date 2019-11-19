import Scheduler from './index'
import logger from '../../config/winston'
const cron = require('node-cron')

describe('Scheduler', () => {
  const mockPlay = jest.fn()
  const mockStop = jest.fn()
  const startMock = jest.fn()
  const infoMock = jest.fn()

  describe('scheduleAutoPlayback', () => {
    beforeAll(() => {
      jest.spyOn(cron, 'schedule').mockImplementation(() => {
        return {
          start: startMock
        }
      });
      jest.spyOn(logger, 'info').mockImplementation(infoMock)
    });

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('it should schedule two jobs, for 8am and 7pm', () => {
      Scheduler.scheduleAutoPlayback({
        play: mockPlay,
        stop: mockStop
      })
      expect(cron.schedule).toHaveBeenCalledTimes(2)
      expect(startMock).toHaveBeenCalledTimes(2)
      expect(cron.schedule.mock.calls[0][0]).toEqual('0 8 * * *')
      expect(cron.schedule.mock.calls[1][0]).toEqual('0 19 * * *')
    })

    it('when the jobs are invoked they should play and stop the jukebox and call the logger', () => {
      Scheduler.scheduleAutoPlayback({
        play: mockPlay,
        stop: mockStop
      })
      cron.schedule.mock.calls[0][1]()
      expect(mockPlay).toHaveBeenCalledTimes(1);
      expect(infoMock).toHaveBeenCalledWith("[Scheduled] Jukebox Played")
      cron.schedule.mock.calls[1][1]()
      expect(mockStop).toHaveBeenCalledTimes(1)
      expect(infoMock).toHaveBeenCalledWith("[Scheduled] Jukebox Stopped")
    })
  })
})
