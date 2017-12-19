import * as images from './index'

describe('images', () => {
  describe('findImageInCache', () => {
    const cache = [
      { ref: 'spotify:track:0c41pMosF5Kqwwegcps8ES' },
      { ref: 'spotify:track:0c41pMosF5Kqwweg123455', uri: 'path/to/file' }
    ]

    it('handles correctly finding an image', () => {
      const uri = 'spotify:track:0c41pMosF5Kqwweg123455'
      expect(images.findImageInCache(uri, cache)).toEqual('path/to/file')
    })

    it('handles correctly not finding an image', () => {
      const uri = 'spotify:track:xxxxx'
      expect(images.findImageInCache(uri, cache)).toBeNull()
    })
  })
})
