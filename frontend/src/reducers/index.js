import { combineReducers } from 'redux'
import track from 'reducers/track'
import tracklist from 'reducers/tracklist'
import assets from 'reducers/assets'
import timer from 'reducers/timer'
import jukebox from 'reducers/jukebox'
import settings from 'reducers/settings'
import search from 'search/reducers'

const jukeboxApp = combineReducers({
  track,
  tracklist,
  assets,
  timer,
  jukebox,
  settings,
  search
})

export default jukeboxApp
