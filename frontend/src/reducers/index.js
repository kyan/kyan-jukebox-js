import { combineReducers } from 'redux'
import track from './track'
import tracklist from './tracklist'
import assets from './assets'
import timer from './timer'
import jukebox from './jukebox'
import settings from './settings'

const jukeboxApp = combineReducers({
  track,
  tracklist,
  assets,
  timer,
  jukebox,
  settings
})

export default jukeboxApp
