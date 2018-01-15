import * as actions from '../../actions'
import MopidyApi from '../../constants/mopidy-api'
import onMessageHandler from './index'

describe('onMessageHandler', () => {
  const myDispatchMock = jest.fn()
  const progressStartMock = jest.fn()
  const progressStopMock = jest.fn()
  const store = { dispatch: myDispatchMock }
  const progress = {
    set: (start, end) => {
      return { start: progressStartMock }
    },
    start: progressStartMock,
    stop: progressStopMock
  }
  let payload = {
    data: {
      track: {
        length: 999,
        album: {
          uri: '112345asdfg'
        }
      }
    }
  }

  beforeEach(() => {
    spyOn(console, 'log')
  })

  describe('MESSAGE_NOT_HANDLED', () => {
    it('handles unknown message', () => {
      const newPayload = Object.assign(
        payload,
        { key: 'message_not_handled' }
      )
      onMessageHandler(store, JSON.stringify(newPayload), progress)
      expect(console.log).toHaveBeenCalled()
    })
  })

  describe('PLAYBACK_GET_CURRENT_TRACK', () => {
    it('handles message', () => {
      const newPayload = Object.assign(
        payload,
        { key: MopidyApi.PLAYBACK_GET_CURRENT_TRACK }
      )
      spyOn(actions, 'addCurrentTrack')
      spyOn(actions, 'getImage')
      onMessageHandler(store, JSON.stringify(newPayload), progress)
      expect(actions.addCurrentTrack).toHaveBeenCalledWith(newPayload.data.track)
      expect(actions.getImage).toHaveBeenCalledWith(newPayload.data.track.album.uri)
      expect(progressStartMock.mock.calls.length).toEqual(1)
      progressStartMock.mockClear()
    })
  })

  describe('EVENT_TRACK_PLAYBACK_STARTED', () => {
    it('handles message', () => {
      const newPayload = Object.assign(
        payload,
        { key: MopidyApi.EVENT_TRACK_PLAYBACK_STARTED }
      )
      spyOn(actions, 'addCurrentTrack')
      spyOn(actions, 'getImage')
      onMessageHandler(store, JSON.stringify(newPayload), progress)
      expect(actions.addCurrentTrack).toHaveBeenCalledWith(newPayload.data.track)
      expect(actions.getImage).toHaveBeenCalledWith(newPayload.data.track.album.uri)
      expect(progressStartMock.mock.calls.length).toEqual(1)
      progressStartMock.mockClear()
    })
  })

  describe('EVENT_PLAYBACK_STATE_CHANGED', () => {
    const newPayload = {
      key: MopidyApi.EVENT_PLAYBACK_STATE_CHANGED,
      data: {}
    }

    afterEach(() => {
      progressStartMock.mockClear()
      progressStopMock.mockClear()
    })

    it('handles playing', () => {
      newPayload.data.new_state = 'playing'
      onMessageHandler(store, JSON.stringify(newPayload), progress)
      expect(progressStartMock.mock.calls.length).toEqual(1)
    })

    it('handles stopping', () => {
      newPayload.data.new_state = 'stopped'
      onMessageHandler(store, JSON.stringify(newPayload), progress)
      expect(progressStopMock.mock.calls.length).toEqual(1)
    })

    it('handles pausing', () => {
      newPayload.data.new_state = 'paused'
      onMessageHandler(store, JSON.stringify(newPayload), progress)
      expect(progressStopMock.mock.calls.length).toEqual(1)
    })

    it('handles state not known', () => {
      newPayload.data.new_state = 'spinningaround'
      onMessageHandler(store, JSON.stringify(newPayload), progress)
      expect(progressStartMock.mock.calls.length).toEqual(0)
      expect(progressStopMock.mock.calls.length).toEqual(0)
    })
  })

  describe('EVENT_TRACKLIST_CHANGED', () => {
    it('handles change', () => {
      const newPayload = Object.assign(
        payload,
        { key: MopidyApi.EVENT_TRACKLIST_CHANGED }
      )
      spyOn(actions, 'getTrackList')
      onMessageHandler(store, JSON.stringify(newPayload), progress)
      expect(actions.getTrackList).toHaveBeenCalled()
    })
  })

  describe('TRACKLIST_GET_TRACKS', () => {
    it('handles change', () => {
      const newPayload = {
        key: MopidyApi.TRACKLIST_GET_TRACKS,
        data: [payload.data]
      }
      spyOn(actions, 'addTrackList')
      spyOn(actions, 'getImage')
      onMessageHandler(store, JSON.stringify(newPayload), progress)
      expect(actions.addTrackList).toHaveBeenCalledWith(newPayload.data)
      expect(actions.getImage).toHaveBeenCalledWith(newPayload.data[0].track.album.uri)
    })
  })

  describe('LIBRARY_GET_IMAGES', () => {
    it('handles resolving', () => {
      const newPayload = Object.assign(
        payload,
        { key: MopidyApi.LIBRARY_GET_IMAGES }
      )
      spyOn(actions, 'resolveImage')
      onMessageHandler(store, JSON.stringify(newPayload), progress)
      expect(actions.resolveImage).toHaveBeenCalledWith(newPayload.data)
    })
  })

  describe('PLAYBACK_GET_TIME_POSITION', () => {
    it('handles resolving', () => {
      const newPayload = {
        data: 4567,
        key: MopidyApi.PLAYBACK_GET_TIME_POSITION
      }
      const progMock = jest.fn()
      const progSetMock = { set: progMock }
      onMessageHandler(store, JSON.stringify(newPayload), progSetMock)
      expect(progMock.mock.calls.length).toEqual(1)
      expect(progMock.mock.calls[0][0]).toEqual(newPayload.data)
    })
  })

  describe('GET_VOLUME', () => {
    it('handles resolving', () => {
      const newPayload = {
        data: 32,
        key: MopidyApi.GET_VOLUME
      }
      spyOn(actions, 'updateVolume')
      onMessageHandler(store, JSON.stringify(newPayload), progress)
      expect(actions.updateVolume).toHaveBeenCalledWith(32)
    })
  })

  describe('GET_VOLUME', () => {
    it('handles resolving', () => {
      const newPayload = {
        data: 32,
        key: MopidyApi.EVENT_VOLUME_CHANGED
      }
      spyOn(actions, 'updateVolume')
      onMessageHandler(store, JSON.stringify(newPayload), progress)
      expect(actions.updateVolume).toHaveBeenCalledWith(32)
    })
  })
})
