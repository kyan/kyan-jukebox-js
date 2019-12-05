import mongoose from 'mongoose'
import logger from 'config/winston'
import MongodbService from './index'
jest.mock('config/winston')

describe('MongodbService', () => {
  it('it should handle a connection success', async () => {
    mongoose.connect = jest.fn(() => Promise.resolve())
    await MongodbService()
    expect(logger.info.mock.calls[0][0]).toEqual('Mongodb Connected')
    expect(logger.info.mock.calls[0][1]).toEqual({ url: 'mongodb://mongodb:27017/jb-dev' })
  })

  it('it should handle a connection failure', async () => {
    mongoose.connect = jest.fn(() => Promise.reject(new Error('bang!')))
    await MongodbService()
    process.nextTick(() => {
      expect(logger.error.mock.calls[0][0]).toEqual('Mongodb: Error: bang!')
      expect(logger.error.mock.calls[0][1]).toEqual({ url: 'mongodb://mongodb:27017/jb-dev' })
    })
  })
})
