import MopidyApi from '../constants/mopidy-api'
import AuthAPI from '../constants/auth-api'
import Types from '../constants'
import { transformUrl } from '../utils/spotify'

export const authenticate = username => {
  return {
    type: Types.SEND,
    key: AuthAPI.AUTHENTICATE_USER,
    params: { 'username': username }
  }
}

export const updateToken = token => {
  return {
    type: Types.STORE_TOKEN,
    token
  }
}

export const updateUsername = username => {
  return {
    type: Types.STORE_USERNAME,
    username
  }
}

export const storeUser = user => {
  return {
    type: Types.STORE_USER,
    user
  }
}

export const addNewTrack = url => {
  let uri = transformUrl(url)

  return {
    type: Types.SEND,
    key: MopidyApi.TRACKLIST_ADD_TRACK,
    params: { 'uri': uri }
  }
}

export const addCurrentTrack = track => {
  return {
    type: Types.ADD_CURRENT_TRACK,
    track
  }
}

export const addTrackList = list => {
  return {
    type: Types.ADD_TRACKS,
    list
  }
}

export const removeFromTracklist = uri => {
  return {
    type: Types.SEND,
    key: MopidyApi.TRACKLIST_REMOVE_TRACK,
    params: { 'uri': [uri] }
  }
}

export const updateProgressTimer = (position, duration) => {
  if (duration === Infinity) { duration = 0 }

  return {
    type: Types.UPDATE_PROGRESS_TIMER,
    position,
    duration
  }
}

export const wsConnect = () => {
  return {
    type: Types.CONNECT
  }
}

export const wsConnecting = () => {
  return {
    type: Types.CONNECTING
  }
}

export const wsConnected = () => {
  return {
    type: Types.CONNECTED
  }
}

export const wsDisconnect = () => {
  return {
    type: Types.DISCONNECT
  }
}

export const wsDisconnected = () => {
  return {
    type: Types.DISCONNECTED
  }
}

export const getCurrentTrack = () => {
  return {
    type: Types.SEND,
    key: MopidyApi.PLAYBACK_GET_CURRENT_TRACK
  }
}

export const getTimePosition = () => {
  return {
    type: Types.SEND,
    key: MopidyApi.PLAYBACK_GET_TIME_POSITION
  }
}

export const getState = () => {
  return {
    type: Types.SEND,
    key: MopidyApi.PLAYBACK_GET_PLAYBACK_STATE
  }
}

export const getImage = (uri) => {
  return {
    type: Types.SEND,
    key: MopidyApi.LIBRARY_GET_IMAGES,
    params: [[uri]],
    uri: uri
  }
}

export const newImage = (uri) => {
  return {
    type: Types.NEW_IMAGE,
    uri
  }
}

export const resolveImage = (data) => {
  return {
    type: Types.RESOLVE_IMAGE,
    data
  }
}

export const getTrackList = () => {
  return {
    type: Types.SEND,
    key: MopidyApi.TRACKLIST_GET_TRACKS
  }
}

export const clearTrackList = () => {
  return {
    type: Types.SEND,
    key: MopidyApi.TRACKLIST_CLEAR
  }
}

export const startPlaying = () => {
  return {
    type: Types.SEND,
    key: MopidyApi.PLAYBACK_PLAY
  }
}

export const pausePlaying = () => {
  return {
    type: Types.SEND,
    key: MopidyApi.PLAYBACK_PAUSE
  }
}

export const nextPlaying = () => {
  return {
    type: Types.SEND,
    key: MopidyApi.PLAYBACK_NEXT
  }
}

export const previousPlaying = () => {
  return {
    type: Types.SEND,
    key: MopidyApi.PLAYBACK_BACK
  }
}

export const getVolume = () => {
  return {
    type: Types.SEND,
    key: MopidyApi.GET_VOLUME
  }
}

export const updateVolume = (volume) => {
  return {
    type: Types.UPDATE_VOLUME,
    volume
  }
}

export const updatePlaybackState = (state) => {
  return {
    type: Types.UPDATE_PLAYBACK_STATE,
    state
  }
}

export const setVolume = (volume) => {
  return {
    type: Types.SEND,
    key: MopidyApi.SET_VOLUME,
    params: [Number(volume)]
  }
}

export const toggleSettings = () => {
  return {
    type: Types.TOGGLE_SETTINGS
  }
}
