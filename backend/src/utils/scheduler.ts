import logger from '../config/logger'
import cron from 'node-cron'

const Scheduler = {
  scheduleAutoPlayback: ({ stop }: { stop: () => void }): void => {
    const stopJukebox = cron.schedule('0 19 * * *', () => {
      stop()
      logger.info('[Scheduled] Jukebox Stopped')
    })

    stopJukebox.start()
  }
}

export default Scheduler
