import { combineReducers } from 'redux'
import track from 'reducers/track'
import tracklist from 'reducers/tracklist'
import timer from 'reducers/timer'
import jukebox from 'reducers/jukebox'
import settings from 'reducers/settings'
import search from 'search/reducers'

const jukeboxApp = combineReducers({
  track,
  tracklist,
  timer,
  jukebox,
  settings,
  search
})

export default jukeboxApp
