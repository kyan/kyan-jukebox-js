import * as spotify from './index'
import { describe, it, expect } from 'bun:test'

describe('spotify', () => {
  describe('transformUrl', () => {
    it('shows the correct format', () => {
      const url = 'https://open.spotify.com/track/0c41pMosF5Kqwwegcps8ES'
      expect(spotify.transformUrl(url)).toEqual('spotify:track:0c41pMosF5Kqwwegcps8ES')
    })

    it('return null if it does not understand', () => {
      const url = 'https://donotunderstand'
      expect(spotify.transformUrl(url)).toBeNull()
    })
  })
})
