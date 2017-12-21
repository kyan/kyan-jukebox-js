import * as actions from './index'
import MopidyApi from '../constants/mopidy-api'
import Types from '../constants'

describe('actions', () => {
  it('should handle addNewTrack', () => {
    const url = 'https://open.spotify.com/track/0c41pMosF5Kqwwegcps8ES'
    const expectedAction = {
      type: Types.SEND,
      key: MopidyApi.TRACKLIST_ADD_TRACK,
      params: { uri: 'spotify:track:0c41pMosF5Kqwwegcps8ES' }
    }
    expect(actions.addNewTrack(url)).toEqual(expectedAction)
  })

  it('should handle addCurrentTrack', () => {
    const track = 'spotify:track:0c41pMosF5Kqwwegcps8ES'
    const expectedAction = {
      type: Types.ADD_CURRENT_TRACK,
      track
    }
    expect(actions.addCurrentTrack(track)).toEqual(expectedAction)
  })

  it('should handle addTrackList', () => {
    const list = ['spotify:track:0c41pMosF5Kqwwegcps8ES']
    const expectedAction = {
      type: Types.ADD_TRACKS,
      list
    }
    expect(actions.addTrackList(list)).toEqual(expectedAction)
  })

  describe('updateProgressTimer', () => {
    it('should handle when Infinity is set', () => {
      const position = 1230
      const duration = 55
      const expectedAction = {
        type: Types.UPDATE_PROGRESS_TIMER,
        position,
        duration
      }
      expect(actions.updateProgressTimer(position, duration))
        .toEqual(expectedAction)
    })

    it('should handle when Infinity is set', () => {
      const position = 100
      const duration = Infinity
      const expectedAction = {
        type: Types.UPDATE_PROGRESS_TIMER,
        position,
        duration: 0
      }
      expect(actions.updateProgressTimer(position, duration))
        .toEqual(expectedAction)
    })
  })

  it('should handle wsConnect', () => {
    const expectedAction = {
      type: Types.CONNECT
    }
    expect(actions.wsConnect()).toEqual(expectedAction)
  })

  it('should handle wsConnecting', () => {
    const expectedAction = {
      type: Types.CONNECTING
    }
    expect(actions.wsConnecting()).toEqual(expectedAction)
  })

  it('should handle wsConnected', () => {
    const expectedAction = {
      type: Types.CONNECTED
    }
    expect(actions.wsConnected()).toEqual(expectedAction)
  })

  it('should handle wsDisconnect', () => {
    const expectedAction = {
      type: Types.DISCONNECT
    }
    expect(actions.wsDisconnect()).toEqual(expectedAction)
  })

  it('should handle wsDisconnected', () => {
    const expectedAction = {
      type: Types.DISCONNECTED
    }
    expect(actions.wsDisconnected()).toEqual(expectedAction)
  })

  it('should handle getCurrentTrack', () => {
    const expectedAction = {
      type: Types.SEND,
      key: MopidyApi.PLAYBACK_GET_CURRENT_TRACK
    }
    expect(actions.getCurrentTrack()).toEqual(expectedAction)
  })

  it('should handle getTimePosition', () => {
    const expectedAction = {
      type: Types.SEND,
      key: MopidyApi.PLAYBACK_GET_TIME_POSITION
    }
    expect(actions.getTimePosition()).toEqual(expectedAction)
  })

  it('should handle getImage', () => {
    const uri = 'spotify:track:0c41pMosF5Kqwwegcps8ES'
    const expectedAction = {
      type: Types.SEND,
      key: MopidyApi.LIBRARY_GET_IMAGES,
      params: [[uri]],
      uri
    }
    expect(actions.getImage(uri)).toEqual(expectedAction)
  })

  it('should handle newImage', () => {
    const uri = 'spotify:track:0c41pMosF5Kqwwegcps8ES'
    const expectedAction = {
      type: Types.NEW_IMAGE,
      uri
    }
    expect(actions.newImage(uri)).toEqual(expectedAction)
  })

  it('should handle resolveImage', () => {
    const data = 'spotify:track:0c41pMosF5Kqwwegcps8ES'
    const expectedAction = {
      type: Types.RESOLVE_IMAGE,
      data
    }
    expect(actions.resolveImage(data)).toEqual(expectedAction)
  })

  it('should handle getTrackList', () => {
    const expectedAction = {
      type: Types.SEND,
      key: MopidyApi.TRACKLIST_GET_TRACKS
    }
    expect(actions.getTrackList()).toEqual(expectedAction)
  })

  it('should handle startPlaying', () => {
    const expectedAction = {
      type: Types.SEND,
      key: MopidyApi.PLAYBACK_PLAY
    }
    expect(actions.startPlaying()).toEqual(expectedAction)
  })

  it('should handle pausePlaying', () => {
    const expectedAction = {
      type: Types.SEND,
      key: MopidyApi.PLAYBACK_PAUSE
    }
    expect(actions.pausePlaying()).toEqual(expectedAction)
  })

  it('should handle nextPlaying', () => {
    const expectedAction = {
      type: Types.SEND,
      key: MopidyApi.PLAYBACK_NEXT
    }
    expect(actions.nextPlaying()).toEqual(expectedAction)
  })

  it('should handle previousPlaying', () => {
    const expectedAction = {
      type: Types.SEND,
      key: MopidyApi.PLAYBACK_BACK
    }
    expect(actions.previousPlaying()).toEqual(expectedAction)
  })

  it('should handle getVolume', () => {
    const expectedAction = {
      type: Types.SEND,
      key: MopidyApi.GET_VOLUME
    }
    expect(actions.getVolume()).toEqual(expectedAction)
  })

  it('should handle updateVolume', () => {
    const expectedAction = {
      type: Types.UPDATE_VOLUME,
      volume: 32
    }
    expect(actions.updateVolume(32)).toEqual(expectedAction)
  })

  it('should handle setVolume', () => {
    const expectedAction = {
      type: Types.SEND,
      key: MopidyApi.SET_VOLUME,
      params: [32]
    }
    expect(actions.setVolume(32)).toEqual(expectedAction)
  })
})
