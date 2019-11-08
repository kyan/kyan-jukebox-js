import Mopidy from 'mopidy'
import logger from '../../../config/winston'
import EventLogger from '../../event-logger'
import MopidyConstants from '../../constants/mopidy'
import Settings from '../../constants/settings'
import Transformer from '../../transformer'
import trackListTrimmer from '../../services/mopidy/tracklist-trimmer'
import Payload from '../../payload'
import storage from '../../local-storage'

const mopidyUrl = process.env.WS_MOPIDY_URL
const mopidyPort = process.env.WS_MOPIDY_PORT

const MopidyService = (io, callback) => {
  const mopidy = new Mopidy({
    webSocketUrl: `ws://${mopidyUrl}:${mopidyPort}/mopidy/ws/`,
    callingConvention: 'by-position-or-by-name'
  })
  const initCurrentTrackState = (mopidy) => {
    storage.clearCurrent()

    Promise.all([
      mopidy.playback.getCurrentTrack(),
      mopidy.tracklist.getTracks()
    ]).then(responses => {
      if (responses[0]) storage.setItem(Settings.TRACK_CURRENT, responses[0].uri)
      storage.setItem(Settings.TRACKLIST_CURRENT, responses[1].map(track => track.uri))
      trackListTrimmer(mopidy)
    })
  }

  mopidy.on('websocket:error', (err) => {
    logger.error(`Mopidy Error: ${err.message}`, { url: `${mopidyUrl}:${mopidyPort}` })
    storage.clearCurrent()
  })

  mopidy.on('state:offline', () => {
    logger.info('Mopidy Offline', { url: `${mopidyUrl}:${mopidyPort}` })
    storage.clearCurrent()
  })

  mopidy.on('state:online', () => {
    logger.info('Mopidy Online', { url: `${mopidyUrl}:${mopidyPort}` })
    initCurrentTrackState(mopidy)
  })

  Object.values(MopidyConstants.EVENTS).forEach(encodedKey => {
    const key = Payload.decodeKey(encodedKey).pop()

    mopidy.on(key, data => {
      const unifiedMessage = Transformer(encodedKey, data, mopidy)
      const payload = Payload.encodeToJson(encodedKey, unifiedMessage)

      EventLogger({ encoded_key: encodedKey }, null, data, 'MopidyEvent')
      io.send(payload)
    })
  })

  callback(mopidy)
}

export default MopidyService
