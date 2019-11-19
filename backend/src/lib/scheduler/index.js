import logger from '../../config/winston'
const cron = require('node-cron')

const Scheduler = {
  scheduleAutoPlayback: ({ stop }) => {
    const stopJukebox = cron.schedule('0 19 * * *', () => {
      stop()
      logger.info('[Scheduled] Jukebox Stopped')
    })

    stopJukebox.start()
  }
}

export default Scheduler
