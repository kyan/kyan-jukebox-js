import Mopidy from 'mopidy'
import logger from '../../../config/winston'
import MopidyConstants from '../../constants/mopidy'
import Transformer from '../../transformer'
import Payload from '../../payload'

const mopidyUrl = process.env.WS_MOPIDY_URL
const mopidyPort = process.env.WS_MOPIDY_PORT

const mopidy = new Mopidy({
  webSocketUrl: `ws://${mopidyUrl}:${mopidyPort}/mopidy/ws/`,
  callingConvention: 'by-position-or-by-name'
})

const MopidyService = (io, callback) => {
  mopidy.on('websocket:error', (err) => {
    logger.error(`Mopidy Error: ${err.message}`, { url: `${mopidyUrl}:${mopidyPort}` })

    // kill app, and let systemctl restart it.
    process.exit()
  })

  mopidy.on('state:offline', () => {
    logger.info('Mopidy Offline', { url: `${mopidyUrl}:${mopidyPort}` })
  })

  mopidy.on('state:online', () => {
    logger.info('Mopidy Online', { url: `${mopidyUrl}:${mopidyPort}` })
  })

  Object.values(MopidyConstants.EVENTS).forEach(raw => {
    const key = Payload.decodeKey(raw).pop()

    mopidy.on(key, data => {
      const encodedKey = Payload.encodeKey('mopidy', key)
      const unifiedMessage = Transformer(encodedKey, data, mopidy)
      const payload = Payload.encodeToJson(encodedKey, unifiedMessage)

      logger.info(`Event: ${encodedKey}: ${payload}`)
      io.send(payload)
    })
  })

  callback(mopidy)
}

export default MopidyService
