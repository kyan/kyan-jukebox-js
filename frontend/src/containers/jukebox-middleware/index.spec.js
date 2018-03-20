import { Server } from 'mock-socket'
import Constants from '../../constants'
import MopidyApi from '../../constants/mopidy-api'
import onMessageHandler from '../../utils/on-message-handler'
import { trackProgressTimer } from '../../utils/time'
import JukeboxMiddleware from './index'

jest.mock('../../utils/on-message-handler')
jest.mock('../../utils/time')
jest.useFakeTimers()

describe('JukeboxMiddleware', () => {
  const wsurl = `ws://${process.env.REACT_APP_WS_URL}:${process.env.REACT_APP_WS_PORT}`
  const mockServer = new Server(wsurl)
  const payload = JSON.stringify({ key: 'foo', data: 'bar' })
  const dispatchSpy = jest.fn()
  const store = {
    dispatch: dispatchSpy,
    getState: jest.fn(() => { return { assets: [] } })
  }
  const next = jest.fn()
  const reset = jest.fn()

  trackProgressTimer.mockImplementationOnce(() => {
    return { reset: reset }
  })

  describe('Constants.CONNECT', () => {
    it('should skip messages it does not understand', () => {
      JukeboxMiddleware(store)(next)({ type: 'YEAHWHATEVER' })
      expect(next).lastCalledWith({ type: 'YEAHWHATEVER' })
    })

    it('should handle connecting and getting new message', () => {
      mockServer.on('connection', server => {
        mockServer.send(payload)
      })
      JukeboxMiddleware(store)(next)({ type: Constants.DISCONNECT })
      JukeboxMiddleware(store)(next)({ type: Constants.CONNECT })
      JukeboxMiddleware(store)(next)({ type: Constants.CONNECT })
      jest.runAllTimers()

      expect(onMessageHandler).toHaveBeenCalledWith(
        store,
        payload,
        jasmine.any(Object)
      )
      expect(dispatchSpy.mock.calls[0][0]).toEqual({ type: 'actionDisconnected' })
      expect(dispatchSpy.mock.calls[1][0]).toEqual({ type: 'actionConnecting' })
      expect(dispatchSpy.mock.calls[2][0]).toEqual({ type: 'actionConnecting' })
      expect(dispatchSpy.mock.calls[3][0]).toEqual({ type: 'actionConnected' })
      expect(dispatchSpy.mock.calls[4][0]).toEqual({
        type: 'actionSend',
        key: 'mopidy::playback.getCurrentTrack'
      })
      expect(dispatchSpy.mock.calls[5][0]).toEqual({
        type: 'actionSend',
        key: 'mopidy::playback.getTimePosition'
      })
      expect(dispatchSpy.mock.calls[6][0]).toEqual({
        type: 'actionSend',
        key: 'mopidy::playback.getState'
      })
      expect(dispatchSpy.mock.calls[7][0]).toEqual({
        type: 'actionSend',
        key: 'mopidy::tracklist.getTracks'
      })
      expect(dispatchSpy.mock.calls[8][0]).toEqual({
        type: 'actionSend',
        key: 'mopidy::mixer.getVolume'
      })
      expect(dispatchSpy.mock.calls[9][0]).toEqual({ type: 'actionConnected' })
      expect(dispatchSpy.mock.calls[10][0]).toEqual({
        type: 'actionSend',
        key: 'mopidy::playback.getCurrentTrack'
      })
      expect(dispatchSpy.mock.calls[11][0]).toEqual({
        type: 'actionSend',
        key: 'mopidy::playback.getTimePosition'
      })
      expect(dispatchSpy.mock.calls[12][0]).toEqual({
        type: 'actionSend',
        key: 'mopidy::playback.getState'
      })
      expect(dispatchSpy.mock.calls[13][0]).toEqual({
        type: 'actionSend',
        key: 'mopidy::tracklist.getTracks'
      })
      dispatchSpy.mockClear()
    })

    it('should dispatch disconnect message', () => {
      JukeboxMiddleware(store)(next)({ type: Constants.CONNECT })
      JukeboxMiddleware(store)(next)({ type: Constants.DISCONNECT })
      expect(dispatchSpy.mock.calls[0][0]).toEqual({ type: 'actionDisconnect' })
      expect(dispatchSpy.mock.calls[1][0]).toEqual({ type: 'actionConnecting' })
      expect(dispatchSpy.mock.calls[2][0]).toEqual({ type: 'actionDisconnected' })
      dispatchSpy.mockClear()
    })

    it('should dispatch send message', () => {
      JukeboxMiddleware(store)(next)({ type: Constants.CONNECT })
      JukeboxMiddleware(store)(next)({
        type: Constants.SEND,
        key: MopidyApi.LIBRARY_GET_IMAGES,
        params: 'params',
        uri: '12345678'
      })
      let storeWithCache = {
        dispatch: dispatchSpy,
        getState: jest.fn(() => {
          return {
            assets: [{ ref: '12345678', uri: 'image123' }]
          }
        })
      }
      JukeboxMiddleware(storeWithCache)(next)({
        type: Constants.SEND,
        key: MopidyApi.LIBRARY_GET_IMAGES,
        params: 'params',
        uri: '12345678'
      })
      JukeboxMiddleware(store)(next)({
        type: Constants.SEND,
        params: 'params'
      })
      JukeboxMiddleware(store)(next)({
        type: Constants.SEND,
        key: MopidyApi.LIBRARY_GET_IMAGES,
        params: 'params',
        uri: null
      })
      jest.runAllTimers()

      expect(dispatchSpy.mock.calls[0][0]).toEqual({ type: 'actionConnecting' })
      expect(dispatchSpy.mock.calls[1][0]).toEqual({
        type: 'actionNewImage',
        uri: '12345678'
      })
      expect(dispatchSpy.mock.calls[2][0]).toEqual({ type: 'actionConnect' })
      expect(dispatchSpy.mock.calls[3][0]).toEqual({ type: 'actionConnected' })
      expect(dispatchSpy.mock.calls[4][0]).toEqual({
        type: 'actionSend',
        key: 'mopidy::playback.getCurrentTrack'
      })
      expect(dispatchSpy.mock.calls[5][0]).toEqual({
        type: 'actionSend',
        key: 'mopidy::playback.getTimePosition'
      })
      expect(dispatchSpy.mock.calls[6][0]).toEqual({
        type: 'actionSend',
        key: 'mopidy::playback.getState'
      })
      expect(dispatchSpy.mock.calls[7][0]).toEqual({
        type: 'actionSend',
        key: 'mopidy::tracklist.getTracks'
      })
      expect(dispatchSpy.mock.calls[8][0]).toEqual({
        type: 'actionSend',
        key: 'mopidy::mixer.getVolume'
      })
      dispatchSpy.mockClear()
    })
  })
})
