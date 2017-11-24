import Constants from '../constants'
import { transformUrl } from '../utils/spotify'

export const addNewTrack = url => {
  let uri = transformUrl(url)

  return {
    type: 'SEND',
    key: Constants.TRACKLIST_ADD_TRACK,
    params: { "uri": uri }
  }
}

export const addCurrentTrack = track => {
  return {
    type: 'ADD_CURRENT_TRACK',
    track
  }
}

export const addTrackList = list => {
  return {
    type: 'ADD_TRACKS',
    list
  }
}

export const updateProgressTimer = (position, duration) => {
  if (duration === Infinity) { duration = 0 }

  return {
    type: 'UPDATE_PROGRESS_TIMER',
    position,
    duration
  }
}

export const wsConnect = () => {
  return {
    type: 'CONNECT'
  }
}

export const wsConnecting = () => {
  return {
    type: 'CONNECTING'
  }
}

export const wsConnected = () => {
  return {
    type: 'CONNECTED'
  }
}

export const wsDisconnect = () => {
  return {
    type: 'DISCONNECT'
  }
}

export const wsDisconnected = () => {
  return {
    type: 'DISCONNECTED'
  }
}

export const getCurrentTrack = () => {
  return {
    type: 'SEND',
    key: Constants.PLAYBACK_GET_CURRENT_TRACK
  }
}

export const getTimePosition = () => {
  return {
    type: 'SEND',
    key: Constants.PLAYBACK_GET_TIME_POSITION
  }
}

export const getImage = (uri, key) => {
  return {
    type: 'SEND',
    key: Constants.LIBRARY_GET_IMAGES,
    params: [[uri]],
    uri: uri
  }
}

export const newImage = (uri) => {
  return {
    type: 'NEW_IMAGE',
    uri
  }
}

export const resolveImage = (data) => {
  return {
    type: 'RESOLVE_IMAGE',
    data
  }
}

export const getTrackList = () => {
  return {
    type: 'SEND',
    key: Constants.TRACKLIST_GET_TRACKS
  }
}

export const startPlaying = () => {
  return {
    type: 'SEND',
    key: Constants.PLAYBACK_SET_STATE,
    params: 'PLAYING'
  }
}

export const pausePlaying = () => {
  return {
    type: 'SEND',
    key: Constants.PLAYBACK_SET_STATE,
    params: 'PAUSED'
  }
}

export const skipPlaying = () => {
  return {
    type: 'SEND',
    key: Constants.PLAYBACK_NEXT
  }
}

