import { describe, it, expect, mock } from 'bun:test'
import * as time from './index'

// Mock media-progress-timer for Bun test
mock.module('media-progress-timer', () => {
  return mock(options => {
    // Immediately call the callback when timer is created
    if (options && options.callback) {
      options.callback(1000, 5000)
    }
    return {
      reset: mock(() => {}),
      start: mock(() => {}),
      stop: mock(() => {}),
      pause: mock(() => {}),
      destroy: mock(() => {})
    }
  })
})

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

    it('returns 0 if NaN', () => {
      const timer = {
        position: null,
        duration: null
      }
      expect(time.timerToPercentage(timer)).toEqual(0)
    })
  })
})
