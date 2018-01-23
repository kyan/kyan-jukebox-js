import Mopidy from 'mopidy'
import MopidyConstants from './constants'
import Payload from '../../payload'

const { WS_MOPIDY = 'localhost:6680' } = process.env

const mopidy = new Mopidy({
  webSocketUrl: `ws://${WS_MOPIDY}/mopidy/ws/`,
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
