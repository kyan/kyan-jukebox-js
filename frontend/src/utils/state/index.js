import * as actions from 'actions'

const State = {
  loadInitial: store => {
    ;['getCurrentTrack', 'getState', 'getTrackList', 'getVolume', 'getTimePosition'].forEach(
      action => {
        store.dispatch(actions[action]())
      }
    )
  }
}

export default State
