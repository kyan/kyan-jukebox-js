import cron from 'node-cron'
import logger from '../config/logger'
import { MopidySettingInterface } from '../services/mopidy'

const Scheduler = {
  scheduleAutoShutdown: (args: MopidySettingInterface): void => {
    const stopJukebox = cron.schedule('0 19 * * *', async () => {
      // Stop the JB
      args.mopidy.playback.stop()

      // Remove all tracks that have been played
      const tracks = await args.setting.getPlayedTracksFromTracklist()
      if (tracks.length > 0) args.mopidy.tracklist.remove({ criteria: { uri: tracks } })

      logger.info('[Scheduled] Jukebox Stopped')
    })

    stopJukebox.start()
  }
}

export default Scheduler
