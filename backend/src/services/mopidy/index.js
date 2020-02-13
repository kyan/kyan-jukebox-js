import Mopidy from 'mopidy'
import logger from 'config/winston'
import EventLogger from 'utils/event-logger'
import MopidyConstants from 'constants/mopidy'
import MessageType from 'constants/message'
import Settings from 'constants/settings'
import Decorator from 'decorators/mopidy'
import trackListTrimmer from 'services/mopidy/tracklist-trimmer'
import storage from 'utils/local-storage'

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

  Object.values(MopidyConstants.CORE_EVENTS).forEach(key => {
    mopidy.on(key, message => {
      EventLogger.info(MessageType.INCOMING_CORE, { key, data: message })

      const packAndSend = (headers, data, messageType) => {
        Decorator[messageType](headers, data, mopidy).then(unifiedMessage => {
          broadcastToAll(headers.key, unifiedMessage)
        })
      }

      if (key === MopidyConstants.CORE_EVENTS.TRACKLIST_CHANGED) {
        Decorator.mopidyCoreMessage({ key }, {}, mopidy)

        mopidy.tracklist.getTracks()
          .then(tracks => {
            packAndSend({ key: MopidyConstants.GET_TRACKS }, tracks, 'parse')
            cacheTrackUris(tracks)
          })
      } else {
        packAndSend({ key }, message, 'mopidyCoreMessage')
      }
    })
  })
}

export default MopidyService
