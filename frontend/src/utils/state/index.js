import * as actions from 'actions'

const State = {
  loadInitial: (store) => {
    [
      'getCurrentTrack',
      'getTimePosition',
      'getState',
      'getTrackList',
      'getVolume'
    ].forEach(action => {
      store.dispatch(actions[action]())
    })
  }
}

export default State
