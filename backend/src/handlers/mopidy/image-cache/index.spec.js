import logger from 'config/winston'
import mockingoose from 'mockingoose'
import ImageCache from './index'
jest.mock('config/winston')

describe('ImageCache', () => {
  beforeEach(() => {
    mockingoose.resetAll()
    jest.clearAllMocks()
  })

  it('passes through a non getImages request', async () => {
    const result = await ImageCache.check('mopidy::playback.stop', null)
    expect(result).toEqual({ image: false })
  })

  describe('when the image fetched from API is found', () => {
    it('handles not finding an image in the cache and adds it ', done => {
      expect.assertions(2)
      mockingoose.Image.toReturn(null, 'findOne')
      mockingoose.Image.toReturn({ uri: 'saved123' }, 'save')

      ImageCache.check('mopidy::library.getImages', [['uri123']])
        .then((result) => {
          expect(result).toEqual({ addToCache: jasmine.any(Function) })
          result.addToCache({ 'uri123': [] }).then((result) => {
            expect(result.uri).toEqual('saved123')
            done()
          })
        })
    })

    it('handles resolving an image ', done => {
      expect.assertions(2)
      mockingoose.Image.toReturn(null, 'findOne')
      mockingoose.Image.toReturn({ uri: 'saved123' }, 'save')

      ImageCache.check('mopidy::library.getImages', [['uri123']])
        .then((result) => {
          expect(result).toEqual({ addToCache: jasmine.any(Function) })
          result.addToCache({ 'uri123': ['uri123'] }).then((result) => {
            expect(result.uri).toEqual('saved123')
            done()
          })
        })
    })
  })

  describe('when the image fetched from API is found', () => {
    it('handles finding an image in the cache and returns it ', done => {
      expect.assertions(2)
      mockingoose.Image.toReturn({ data: 'cached123' }, 'findOne')

      ImageCache.check('mopidy::library.getImages', [['uri123']])
        .then((result) => {
          expect(result).toEqual({ image: 'cached123' })
          expect(logger.info).toHaveBeenCalledWith('FOUND CACHED IMAGE', { key: 'uri123' })
          done()
        })
    })
  })
})
