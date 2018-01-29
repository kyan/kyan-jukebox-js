import ImageCache from './index'

describe('ImageCache', () => {
  const cb = jest.fn()

  it('passes through a non getImages request', () => {
    ImageCache.check('mopidy::playback.stop', null, cb)
    expect(cb.mock.calls.length).toEqual(1)
    expect(cb.mock.calls[0][0]).toBeNull()
    expect(cb.mock.calls[0][1]).toEqual({ image: false })
    cb.mockClear()
  })

  it('handles not finding an image in the cache', () => {
    ImageCache.check('mopidy::library.getImages', [['uri123']], cb)
    expect(cb.mock.calls.length).toEqual(1)
    expect(cb.mock.calls[0][0]).toBeNull()
    expect(cb.mock.calls[0][1]).toEqual({ addToCache: jasmine.any(Function) })
    cb.mock.calls[0][1].addToCache('uri123')
    cb.mockClear()
  })

  it('handles finding an image in the cache', () => {
    spyOn(console, 'log')
    ImageCache.check('mopidy::library.getImages', [['uri123']], cb)
    expect(cb.mock.calls.length).toEqual(1)
    expect(console.log).toHaveBeenCalledWith(
      'Using cached: ',
      'mopidy::library.getImagesuri123'
    )
    cb.mockClear()
  })

  describe('clearing the cache', () => {
    beforeEach(() => {
      process.env = { MAX_IMG_CACHE_SIZE: 1 }
    })

    it('clears the cache', () => {
      ImageCache.check('mopidy::library.getImages', [['uri124']], cb)
      cb.mock.calls[0][1].addToCache('uri124')
      cb.mockClear()
      ImageCache.check('mopidy::library.getImages', [['uri125']], cb)
      cb.mock.calls[0][1].addToCache('uri125')
      cb.mockClear()
    })
  })
})
