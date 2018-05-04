import mockingoose from 'mockingoose'
import ImageCache from './index'

describe('ImageCache', () => {
  const cb = jest.fn()

  beforeEach(() => {
    mockingoose.resetAll()
    jest.clearAllMocks()
  })

  it('passes through a non getImages request', async () => {
    await ImageCache.check('mopidy::playback.stop', null, cb)
    expect(cb.mock.calls.length).toEqual(1)
    expect(cb.mock.calls[0][0]).toBeNull()
    expect(cb.mock.calls[0][1]).toEqual({ image: false })
  })

  describe('when the image fetched from API is found', () => {
    it('handles not finding an image in the cache and adds it ', async () => {
      mockingoose.Image.toReturn(null, 'findOne')

      await ImageCache.check('mopidy::library.getImages', [['uri123']], cb)
      expect(cb.mock.calls.length).toEqual(1)
      expect(cb.mock.calls[0][0]).toBeNull()
      expect(cb.mock.calls[0][1]).toEqual({ addToCache: jasmine.any(Function) })
      cb.mock.calls[0][1].addToCache({ 'uri123': ['image1'] })
    })
  })

  describe('when the image fetched from API is not found', () => {
    it('handles not finding an image in the cache and adds it ', async () => {
      mockingoose.Image.toReturn(null, 'findOne')

      await ImageCache.check('mopidy::library.getImages', [['uri123']], cb)
      expect(cb.mock.calls.length).toEqual(1)
      expect(cb.mock.calls[0][0]).toBeNull()
      expect(cb.mock.calls[0][1]).toEqual({ addToCache: jasmine.any(Function) })
      cb.mock.calls[0][1].addToCache({ 'uri123': [] })
    })
  })

  it('handles finding an image in the cache', async () => {
    spyOn(console, 'log')
    mockingoose.Image.toReturn({ data: 'xxxx' }, 'findOne')

    await ImageCache.check('mopidy::library.getImages', [['uri123']], cb)
    expect(cb.mock.calls.length).toEqual(1)
    expect(console.log).toHaveBeenCalledWith(
      'Using cache: mopidy::library.getImages#uri123'
    )
  })
})
