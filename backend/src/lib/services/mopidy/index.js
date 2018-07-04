import Mopidy from 'mopidy'
import logger from '../../../config/winston'
import MopidyConstants from '../../constants/mopidy'
import Payload from '../../payload'

const mopidyUrl = process.env.WS_MOPIDY_URL
const mopidyPort = process.env.WS_MOPIDY_PORT

const mopidy = new Mopidy({
  webSocketUrl: `ws://${mopidyUrl}:${mopidyPort}/mopidy/ws/`,
  callingConvention: 'by-position-or-by-name'
})

const MopidyService = (broadcaster, callback) => {
  mopidy.on('websocket:error', (err) => {
    logger.error(`Mopidy Error: ${err.message}`, { url: `${mopidyUrl}:${mopidyPort}` })

    // kill app, and let systemctl restart it.
    process.exit()
  })

  mopidy.on('state:online', () => {
    logger.info('Mopidy Online', { url: `${mopidyUrl}:${mopidyPort}` })

    Object.values(MopidyConstants.EVENTS).forEach(raw => {
      const key = Payload.decodeKey(raw).pop()

      mopidy.on(key, data => {
        const encodedKey = Payload.encodeKey('mopidy', key)
        broadcaster.everyone(encodedKey, data)
      })
    })

    callback(mopidy)
  })
}

export default MopidyService
