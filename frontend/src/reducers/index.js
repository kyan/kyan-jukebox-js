import { combineReducers } from 'redux'
import track from './track'
import assets from './assets'
import payload from './payload'

const jukeboxApp = combineReducers({
  track,
  assets,
  payload
})

export default jukeboxApp
