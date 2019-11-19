import logger from '../../config/winston'
const cron = require('node-cron')

const Scheduler = {
  scheduleAutoPlayback: ({ play, stop }) => {
    const playJukebox = cron.schedule('0 8 * * *', () => {
      play()
      logger.info('[Scheduled] Jukebox Played')
    })
    const stopJukebox = cron.schedule('0 19 * * *', () => {
      stop()
      logger.info('[Scheduled] Jukebox Stopped')
    })

    playJukebox.start()
    stopJukebox.start()
  }
}

export default Scheduler
