import mongoose from 'mongoose'
import logger from '../../src/config/logger'
import MongodbService from '../../src/services/mongodb'
jest.mock('../../src/config/logger')

describe('MongodbService', () => {
  it('should handle a connection success', async () => {
    expect.assertions(1)
    mongoose.connect = jest.fn().mockResolvedValue(true)

    await MongodbService()
    expect(logger.info).toHaveBeenCalledWith('Mongodb Connected', {
      url: 'mongodb://localhost:27017/jb-dev'
    })
  })

  it('should handle a connection failure', () => {
    expect.assertions(2)
    mongoose.connect = jest.fn(() => Promise.reject(new Error('bang!')))

    return MongodbService().catch((error) => {
      expect(error.message).toEqual('MongoDB failed to connect!')

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(logger.error).toHaveBeenCalledWith('Mongodb: Error: bang!', {
            url: 'mongodb://localhost:27017/jb-dev'
          })
          resolve()
        }, 0)
      })
    })
  })
})
