import Mopidy from 'mopidy'
import logger from 'config/winston'
import EventLogger from 'utils/event-logger'
import MopidyConstants from 'constants/mopidy'
import MessageType from 'constants/message'
import Settings from 'constants/settings'
import Transform from 'utils/transformer'
import trackListTrimmer from 'services/mopidy/tracklist-trimmer'
import Payload from 'utils/payload'
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

  Object.values(MopidyConstants.CORE_EVENTS).forEach(encodedKey => {
    const key = Payload.decodeKey(encodedKey).pop()

    mopidy.on(key, message => {
      EventLogger({ encoded_key: key }, null, message, MessageType.INCOMING_CORE)

      const packAndSend = (data, key, messageType) => {
        Transform[messageType](key, data, mopidy).then(unifiedMessage => {
          broadcastToAll(key, unifiedMessage)
        })
      }

      if (encodedKey === MopidyConstants.CORE_EVENTS.TRACKLIST_CHANGED) {
        mopidy.tracklist.getTracks()
          .then(tracks => {
            packAndSend(tracks, MopidyConstants.GET_TRACKS, 'message')
            cacheTrackUris(tracks)
            trackListTrimmer(mopidy)
          })
      } else {
        packAndSend(message, encodedKey, 'mopidyCoreMessage')
      }
    })
  })
}

export default MopidyService
