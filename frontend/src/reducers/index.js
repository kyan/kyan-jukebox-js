import { combineReducers } from 'redux'
import track from './track'
import tracklist from './tracklist'
import assets from './assets'
import timer from './timer'

const jukeboxApp = combineReducers({
  track,
  tracklist,
  assets,
  timer
})

export default jukeboxApp
