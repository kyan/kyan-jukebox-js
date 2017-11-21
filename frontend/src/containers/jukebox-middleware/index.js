import * as actions from '../../actions'
import { findImageInCache } from '../../utils/images'
import ProgressTimer from 'media-progress-timer'

const JukeboxMiddleware = (() => {
  let socket = null
  let progressTimer = null

  const refreshInitialState = (store) => {
    ['getCurrentTrack', 'getTimePosition', 'getTrackList'].forEach(action => {
      store.dispatch(actions[action]())
    })
  }

  const onOpen = (ws, store, token) => evt => {
    progressTimer = ProgressTimer({
      callback: (position, duration) => {
        store.dispatch(actions.updateProgressTimer(position, duration))
      },
      fallbackTargetFrameRate: 1,
      disableRequestAnimationFrame: true
    })
    refreshInitialState(store)
  }

  const onClose = (ws, store) => evt => {
    store.dispatch(actions.wsDisconnected())
    progressTimer.reset()
  }

  const onMessage = (ws, store) => evt => {
    let result = JSON.parse(evt.data)
    let { key, data } = result
    store.dispatch(actions.storePayload(evt.data))

    switch (key) {
      case 'playback.getCurrentTrack':
        store.dispatch(actions.addTrack(data.track))
        progressTimer.set(0, data.track.length).start()
        store.dispatch(actions.getImage(data.track.album.uri))
        break
      case 'event:trackPlaybackStarted':
        store.dispatch(actions.addTrack(data.track))
        progressTimer.set(0, data.track.length).start()
        store.dispatch(actions.getImage(data.track.album.uri))
        break
      case 'event:playbackStateChanged':
        switch (data.new_state) {
          case 'paused':
          case 'stopped':
            progressTimer.stop()
            break
          case 'playing':
            progressTimer.start()
            break
          default:
            break
        }
        break
      case 'event:tracklistChanged':
        store.dispatch(actions.getTrackList())
        break
      case 'tracklist.getTracks':
        store.dispatch(actions.addTrackList(data))
        data.forEach(item => {
          store.dispatch(actions.getImage(item.track.album.uri))
        })
        break
      case 'library.getImages':
        store.dispatch(actions.resolveImage(data))
        break
      case 'playback.getTimePosition':
        progressTimer.set(data)
        break
      default:
        console.log(`Unknown message: ${key} body: ${data}`)
        break
    }
  }

  return store => next => action => {
    switch (action.type) {
      case 'CONNECT':
        if (socket != null) { socket.close(); }
        store.dispatch(actions.wsConnecting())

        socket = new WebSocket(action.url)
        socket.onmessage = onMessage(socket, store)
        socket.onclose = onClose(socket, store)
        socket.onopen = onOpen(socket, store)
        break
      case 'DISCONNECT':
        if (socket != null) { socket.close(); }
        socket = null
        store.dispatch(actions.wsDisconnected())
        break
      case 'SEND':
        if (action.key === 'library.getImages') {
          if (findImageInCache(action.uri, store.getState().assets)) {
            break
          }
          store.dispatch(actions.newImage(action.uri))
        }

        socket.send(JSON.stringify({
          key: action.key,
          params: action.params
        }))
        break;
      default:
        return next(action)
    }
  }
})()

export default JukeboxMiddleware
