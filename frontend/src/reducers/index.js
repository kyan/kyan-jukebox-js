import { combineReducers } from 'redux'
import track from './track'
import tracklist from './tracklist'
import assets from './assets'
import payload from './payload'

const jukeboxApp = combineReducers({
  track,
  tracklist,
  assets,
  payload
})

export default jukeboxApp
