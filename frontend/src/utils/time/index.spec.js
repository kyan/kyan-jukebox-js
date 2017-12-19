import * as time from './index'

jest.useFakeTimers()

describe('time', () => {
  describe('millisToMinutesAndSeconds', () => {
    it('shows the correct format', () => {
      expect(time.millisToMinutesAndSeconds(345666)).toEqual('5:46')
    })

    it('shows the correct format when passed nothing', () => {
      expect(time.millisToMinutesAndSeconds(0)).toEqual('0:00')
    })
  })

  describe('millisToSeconds', () => {
    it('shows the correct format', () => {
      expect(time.millisToSeconds(34560)).toEqual(34.56)
    })

    it('shows the correct format when passed nothing', () => {
      expect(time.millisToSeconds(0)).toEqual(0)
    })
  })

  describe('timerToPercentage', () => {
    it('shows the correct format', () => {
      const timer = {
        position: 250,
        duration: 1000
      }
      expect(time.timerToPercentage(timer)).toEqual(25)
    })

    it('returns 0 if duration is 0', () => {
      const timer = {
        position: 250,
        duration: 0
      }
      expect(time.timerToPercentage(timer)).toEqual(0)
    })
  })

  describe('trackProgressTimer', () => {
    it('shows the correct format', () => {
      const dispatchMock = jest.fn()
      const updateProgressTimerMock = jest.fn()
      const store = { dispatch: dispatchMock }
      const actions = { updateProgressTimer: updateProgressTimerMock }
      time.trackProgressTimer(store, actions)
      jest.runOnlyPendingTimers()
      expect(dispatchMock.mock.calls.length).toEqual(1)
      expect(updateProgressTimerMock.mock.calls.length).toEqual(1)
    })
  })
})
