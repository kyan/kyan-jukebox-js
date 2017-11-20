import { combineReducers } from 'redux'
import track from './track'
import tracklist from './tracklist'
import assets from './assets'
import payload from './payload'
import timer from './timer'

const jukeboxApp = combineReducers({
  track,
  tracklist,
  assets,
  payload,
  timer
})

export default jukeboxApp
