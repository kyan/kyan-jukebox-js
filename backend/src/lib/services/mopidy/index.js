import Mopidy from 'mopidy'
import logger from 'config/winston'
import EventLogger from '../../event-logger'
import MopidyConstants from 'constants/mopidy'
import Settings from 'constants/settings'
import Transformer from '../../transformer'
import trackListTrimmer from '../../services/mopidy/tracklist-trimmer'
import Payload from '../../payload'
import storage from '../../local-storage'

const mopidyUrl = process.env.WS_MOPIDY_URL
const mopidyPort = process.env.WS_MOPIDY_PORT
let firstTime = false

const MopidyService = (broadcastToAll, mopidyState, cbAllowConnections) => {
  const mopidy = new Mopidy({
    webSocketUrl: `ws://${mopidyUrl}:${mopidyPort}/mopidy/ws/`,
    callingConvention: 'by-position-or-by-name'
  })

  const cacheTrackUris = (tracks) => (
    storage.setItem(Settings.TRACKLIST_CURRENT, tracks.map(track => track.uri))
  )

  const initCurrentTrackState = (mopidy) => {
    Promise.all([
      mopidy.playback.getCurrentTrack(),
      mopidy.tracklist.getTracks()
    ]).then(responses => {
      storage.clearCurrent()
      if (responses[0]) storage.setItem(Settings.TRACK_CURRENT, responses[0].uri)
      cacheTrackUris(responses[1])
      trackListTrimmer(mopidy)

      firstTime ? mopidyState(true) : cbAllowConnections(mopidy)
      firstTime = true
    })
  }

  mopidy.on('websocket:error', (err) => {
    logger.error(`Mopidy Error: ${err.message}`, { url: `${mopidyUrl}:${mopidyPort}` })
    storage.clearCurrent()
  })

  mopidy.on('state:offline', () => {
    logger.info('Mopidy Offline', { url: `${mopidyUrl}:${mopidyPort}` })
    mopidyState(false)
    storage.clearCurrent()
  })

  mopidy.on('state:online', () => {
    logger.info('Mopidy Online', { url: `${mopidyUrl}:${mopidyPort}` })
    initCurrentTrackState(mopidy)
  })

  Object.values(MopidyConstants.EVENTS).forEach(encodedKey => {
    const key = Payload.decodeKey(encodedKey).pop()

    mopidy.on(key, message => {
      const packAndSend = (data, key) => {
        const unifiedMessage = Transformer(key, data, mopidy)
        const payload = Payload.encodeToJson(key, unifiedMessage)
        EventLogger({ encoded_key: key }, null, payload, 'MopidyEvent')
        broadcastToAll(payload)
      }

      if (encodedKey === MopidyConstants.EVENTS.TRACKLIST_CHANGED) {
        mopidy.tracklist.getTracks()
          .then(tracks => {
            packAndSend(tracks, MopidyConstants.GET_TRACKS)
            cacheTrackUris(tracks)
            trackListTrimmer(mopidy)
          })
      } else {
        packAndSend(message, encodedKey)
      }
    })
  })
}

export default MopidyService
