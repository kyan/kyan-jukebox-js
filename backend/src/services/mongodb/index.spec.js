import mongoose from 'mongoose'
import logger from 'config/winston'
import MongodbService from './index'
jest.mock('config/winston')

describe('MongodbService', () => {
  it('it should handle a connection success', () => {
    expect.assertions(1)
    mongoose.connect = jest.fn(() => Promise.resolve())

    return MongodbService().then(() => {
      expect(logger.info).toHaveBeenCalledWith(
        'Mongodb Connected',
        { url: 'mongodb://mongodb:27017/jb-dev' }
      )
    })
  })

  it('it should handle a connection failure', done => {
    expect.assertions(2)
    mongoose.connect = jest.fn(() => Promise.reject(new Error('bang!')))

    MongodbService().catch((error) => {
      expect(error.message).toEqual('MongoDB failed to connect!')

      setTimeout(() => {
        try {
          expect(logger.error).toHaveBeenCalledWith(
            'Mongodb: Error: bang!',
            { url: 'mongodb://mongodb:27017/jb-dev' }
          )
          done()
        } catch (err) {
          done.fail(err)
        }
      })
    })
  })
})
