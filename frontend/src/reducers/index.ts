import { combineReducers } from 'redux'
import track from 'reducers/track'
import tracklist from 'reducers/tracklist'
import timer from 'reducers/timer'
import jukebox from 'reducers/jukebox'
import settings from 'reducers/settings'
import search from 'search/reducers/search'
import curatedList from 'search/reducers/curated-list'

import type { JukeboxState } from 'reducers/jukebox'

export interface JukeboxAppState {
  track: object
  tracklist: object
  timer: object
  jukebox: JukeboxState
  settings: object
  search: object
  curatedList: object
}

const jukeboxApp = combineReducers({
  track,
  tracklist,
  timer,
  jukebox,
  settings,
  search,
  curatedList
})

export default jukeboxApp
