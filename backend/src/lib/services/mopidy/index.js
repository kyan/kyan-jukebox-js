import Mopidy from 'mopidy'
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
    console.log(`Mopidy [${mopidyUrl}:${mopidyPort}]: Error: ${err}`)

    const encodedKey = Payload.encodeKey('mopidy', 'connectionError')
    broadcaster.everyone(encodedKey, String(err))
  })

  mopidy.on('state:online', () => {
    console.log(`Mopidy [${mopidyUrl}:${mopidyPort}]: Online!`)

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
