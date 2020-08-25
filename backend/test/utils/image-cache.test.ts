import EventLogger from '../../src/utils/event-logger'
import mockingoose from 'mockingoose'
import ImageCache from '../../src/utils/image-cache'
import logger from '../../src/config/logger'
jest.mock('../../src/utils/event-logger')
jest.mock('../../src/config/logger')

describe('ImageCache', () => {
  beforeEach(() => {
    mockingoose.resetAll()
    jest.clearAllMocks()
  })

  describe('findAll', () => {
    it('finds some images and returns them', async () => {
      const _doc = {
        _id: 'spotify123',
        url: 'path/to/image'
      }
      expect.assertions(2)
      mockingoose.Image.toReturn([_doc], 'find')

      const result = await ImageCache.findAll([_doc._id])
      expect(result).toMatchObject([_doc])
      expect(EventLogger.info).toHaveBeenCalledWith('FOUND CACHED IMAGES', {
        data: ['spotify123']
      })
    })

    it('finds no images and returns them', async () => {
      const _doc = {
        _id: 'spotify123',
        url: 'path/to/image'
      }
      expect.assertions(2)
      mockingoose.Image.toReturn([], 'find')

      const result = await ImageCache.findAll([_doc._id])
      expect(result).toMatchObject([])
      expect(EventLogger.info).not.toHaveBeenCalled()
    })

    it('handles errors', () => {
      expect.assertions(1)

      return ImageCache.findAll(['xxx']).catch((error) => {
        expect(error.message).toEqual("Cannot read property 'length' of undefined")
      })
    })
  })

  describe('addAll', () => {
    it('exits early if no data', async () => {
      const result = await ImageCache.addAll(null)
      expect(result).toEqual(null)
    })

    it('handles resolving an image ', async () => {
      expect.assertions(1)
      mockingoose.Image.toReturn({ url: 'path' }, 'findOneAndUpdate')

      const result = await ImageCache.addAll({ spotify123: 'path/to/image' })
      expect(result).toMatchObject([{ url: 'path' }])
    })

    it('handles mongo errors', () => {
      expect.assertions(1)
      mockingoose.Image.toReturn(new Error('boom'), 'findOneAndUpdate')
      ImageCache.addAll({ spotify123: 'path/to/image' })

      return new Promise((resolve) => {
        setTimeout(() => {
          expect(logger.error).toHaveBeenCalledWith(
            'storeImages:Image.findOneAndUpdate',
            { message: 'boom' }
          )
          resolve()
        }, 0)
      })
    })

    it('handles misformatted image data', () => {
      expect.assertions(1)

      return ImageCache.addAll({ xxx: null }).catch((error) => {
        expect(error.message).toEqual('storeImages: Bad data')
      })
    })
  })
})
