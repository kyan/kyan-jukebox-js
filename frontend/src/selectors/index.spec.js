import * as selectors from './index'

describe('selectors', () => {
  const cache = [
    { ref: 'spotify:track:0c41pMosF5Kqwwegcps8ES' },
    { ref: 'spotify:track:0c41pMosF5Kqwweg123455', uri: 'path/to/file' },
    { ref: 'spotify:track:0c41pMosF5Kqwwegxxxxxx', uri: 'path/to/file1' }
  ]

  describe('getCurrentTrackImageInCache', () => {
    const track = { album: { uri: 'spotify:track:0c41pMosF5Kqwweg123455' } }

    it('correctly find an image in the cache', () => {
      const sel = selectors.getCurrentTrackImageInCache({
        track: track,
        assets: cache
      })
      expect(sel).toEqual('path/to/file')
    })

    it('handles no track correctly', () => {
      const sel = selectors.getCurrentTrackImageInCache({
        track: null,
        assets: cache
      })
      expect(sel).toBeNull()
    })
  })

  describe('getTracklistImagesInCache', () => {
    const tracks = [
      { album: { uri: 'spotify:track:0c41pMosF5Kqwweg123455' } },
      { album: { uri: 'spotify:track:0c41pMosF5Kqwwegxxxxxx' } }
    ]

    it('behaves correctly', () => {
      const sel = selectors.getTracklistImagesInCache({
        tracklist: tracks,
        assets: cache
      })
      expect(sel).toEqual({
        'spotify:track:0c41pMosF5Kqwweg123455': 'path/to/file',
        'spotify:track:0c41pMosF5Kqwwegxxxxxx': 'path/to/file1'
      })
    })
  })
})
