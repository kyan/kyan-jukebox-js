import logger from '../../../../config/winston'
import Settings from '../../../constants/settings'
import storage from '../../../local-storage'

const previousTracksCount = 4

const tracklistTrimmer = function (mopidy) {
  const currentTrack = storage.getItem(Settings.TRACK_CURRENT)
  const currentTracklist = storage.getItem(Settings.TRACKLIST_CURRENT)
  const currentTrackIndex = currentTracklist.indexOf(currentTrack)

  if (currentTrackIndex > previousTracksCount) {
    const indexToDeleteTo = currentTrackIndex - previousTracksCount
    const tracksToTrim = currentTracklist.slice(0, indexToDeleteTo)
    mopidy.tracklist.remove({ uri: tracksToTrim })
    logger.info(`Trimming tracklist ${tracksToTrim}`)
  }
}

export default tracklistTrimmer