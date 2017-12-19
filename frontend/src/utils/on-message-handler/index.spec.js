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

  describe('MESSAGE_NOT_HANDLED', () => {
    it('handles unknown message', () => {
      const new_payload = Object.assign(
        payload,
        { key: 'message_not_handled' }
      )
      spyOn(console, 'log')
      onMessageHandler(store, JSON.stringify(new_payload), progress)
      expect(console.log).toHaveBeenCalled()
    })
  })

  describe('PLAYBACK_GET_CURRENT_TRACK', () => {
    it('handles message', () => {
      const new_payload = Object.assign(
        payload,
        { key: MopidyApi.PLAYBACK_GET_CURRENT_TRACK }
      )
      spyOn(actions, 'addCurrentTrack')
      spyOn(actions, 'getImage')
      onMessageHandler(store, JSON.stringify(new_payload), progress)
      expect(actions.addCurrentTrack).toHaveBeenCalledWith(new_payload.data.track)
      expect(actions.getImage).toHaveBeenCalledWith(new_payload.data.track.album.uri)
      expect(progressStartMock.mock.calls.length).toEqual(1)
      progressStartMock.mockClear()
    })
  })

  describe('EVENT_TRACK_PLAYBACK_STARTED', () => {
    it('handles message', () => {
      const new_payload = Object.assign(
        payload,
        { key: MopidyApi.EVENT_TRACK_PLAYBACK_STARTED }
      )
      spyOn(actions, 'addCurrentTrack')
      spyOn(actions, 'getImage')
      onMessageHandler(store, JSON.stringify(new_payload), progress)
      expect(actions.addCurrentTrack).toHaveBeenCalledWith(new_payload.data.track)
      expect(actions.getImage).toHaveBeenCalledWith(new_payload.data.track.album.uri)
      expect(progressStartMock.mock.calls.length).toEqual(1)
      progressStartMock.mockClear()
    })
  })

  describe('EVENT_PLAYBACK_STATE_CHANGED', () => {
    const new_payload = {
      key: MopidyApi.EVENT_PLAYBACK_STATE_CHANGED,
      data: {}
    }

    afterEach(() => {
      progressStartMock.mockClear()
      progressStopMock.mockClear()
    })

    it('handles playing', () => {
      new_payload.data.new_state = 'playing'
      onMessageHandler(store, JSON.stringify(new_payload), progress)
      expect(progressStartMock.mock.calls.length).toEqual(1)
    })

    it('handles stopping', () => {
      new_payload.data.new_state = 'stopped'
      onMessageHandler(store, JSON.stringify(new_payload), progress)
      expect(progressStopMock.mock.calls.length).toEqual(1)
    })

    it('handles pausing', () => {
      new_payload.data.new_state = 'paused'
      onMessageHandler(store, JSON.stringify(new_payload), progress)
      expect(progressStopMock.mock.calls.length).toEqual(1)
    })

    it('handles state not known', () => {
      new_payload.data.new_state = 'spinningaround'
      onMessageHandler(store, JSON.stringify(new_payload), progress)
      expect(progressStartMock.mock.calls.length).toEqual(0)
      expect(progressStopMock.mock.calls.length).toEqual(0)
    })
  })

  describe('EVENT_TRACKLIST_CHANGED', () => {
    it('handles change', () => {
      const new_payload = Object.assign(
        payload,
        { key: MopidyApi.EVENT_TRACKLIST_CHANGED }
      )
      spyOn(actions, 'getTrackList')
      onMessageHandler(store, JSON.stringify(new_payload), progress)
      expect(actions.getTrackList).toHaveBeenCalled()
    })
  })

  describe('TRACKLIST_GET_TRACKS', () => {
    it('handles change', () => {
      const new_payload = {
        key: MopidyApi.TRACKLIST_GET_TRACKS,
        data: [payload.data]
      }
      spyOn(actions, 'addTrackList')
      spyOn(actions, 'getImage')
      onMessageHandler(store, JSON.stringify(new_payload), progress)
      expect(actions.addTrackList).toHaveBeenCalledWith(new_payload.data)
      expect(actions.getImage).toHaveBeenCalledWith(new_payload.data[0].track.album.uri)
    })
  })

  describe('LIBRARY_GET_IMAGES', () => {
    it('handles resolving', () => {
      const new_payload = Object.assign(
        payload,
        { key: MopidyApi.LIBRARY_GET_IMAGES }
      )
      spyOn(actions, 'resolveImage')
      onMessageHandler(store, JSON.stringify(new_payload), progress)
      expect(actions.resolveImage).toHaveBeenCalledWith(new_payload.data)
    })
  })

  describe('PLAYBACK_GET_TIME_POSITION', () => {
    it('handles resolving', () => {
      const new_payload = {
        data: 4567,
        key: MopidyApi.PLAYBACK_GET_TIME_POSITION
      }
      const progMock = jest.fn()
      const progSetMock = { set: progMock }
      onMessageHandler(store, JSON.stringify(new_payload), progSetMock)
      expect(progMock.mock.calls.length).toEqual(1)
      expect(progMock.mock.calls[0][0]).toEqual(new_payload.data)
    })
  })
})
