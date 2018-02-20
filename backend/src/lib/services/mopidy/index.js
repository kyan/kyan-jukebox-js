import Mopidy from 'mopidy'
import MopidyConstants from './constants'
import Payload from '../../payload'

const mopidyUrl = process.env.WS_MOPIDY_URL
const mopidyPort = process.env.WS_MOPIDY_PORT

const mopidy = new Mopidy({
  webSocketUrl: `ws://${mopidyUrl}:${mopidyPort}/mopidy/ws/`,
  callingConvention: 'by-position-or-by-name'
})

const MopidyService = (broadcaster, callback) => {
  mopidy.on('state:online', () => {
    MopidyConstants.EVENTS.forEach(key => {
      mopidy.on(key, data => {
        const encodedKey = Payload.encodeKey('mopidy', key)
        broadcaster.everyone(encodedKey, data)
      })
    })

    callback(mopidy)
  })
}

export default MopidyService
