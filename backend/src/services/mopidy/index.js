import Mopidy from 'mopidy'
import logger from 'config/winston'
import EventLogger from 'utils/event-logger'
import MopidyConstants from 'constants/mopidy'
import MessageType from 'constants/message'
import Decorator from 'decorators/mopidy'
import {
  clearState,
  initializeState,
  trimTracklist,
  updateTracklist
} from 'services/mongodb/models/setting'

const mopidyUrl = process.env.WS_MOPIDY_URL
const mopidyPort = process.env.WS_MOPIDY_PORT
let firstTime = false

const MopidyService = (broadcastToAll, mopidyState) => {
  return new Promise((resolve) => {
    const mopidy = new Mopidy({
      webSocketUrl: `ws://${mopidyUrl}:${mopidyPort}/mopidy/ws/`
    })

    const initCurrentTrackState = (mopidy) => {
      Promise.all([
        mopidy.playback.getCurrentTrack(),
        mopidy.tracklist.getTracks()
      ]).then(responses => {
        return initializeState(responses[0], responses[1])
          .then(() => trimTracklist(mopidy))
          .then(() => {
            firstTime ? mopidyState({ online: true }) : resolve(mopidy)
            firstTime = true
          })
      })
    }

    mopidy.on('websocket:error', (err) => {
      logger.error(`Mopidy Error: ${err.message}`, { url: `${mopidyUrl}:${mopidyPort}` })
      clearState()
    })

    mopidy.on('state:offline', () => {
      logger.info('Mopidy Offline', { url: `${mopidyUrl}:${mopidyPort}` })
      mopidyState({ online: false })
      clearState()
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
            broadcastToAll({ headers: { key: headers.key }, message: unifiedMessage })
          })
        }

        if (key === MopidyConstants.CORE_EVENTS.TRACKLIST_CHANGED) {
          mopidy.tracklist.getTracks()
            .then(tracks => {
              return updateTracklist(tracks.map(track => track.uri))
                .then(() => packAndSend({ key: MopidyConstants.GET_TRACKS }, tracks, 'parse'))
            })
        } else {
          packAndSend({ key }, message, 'mopidyCoreMessage')
        }
      })
    })
  })
}

export default MopidyService
