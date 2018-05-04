import MongodbService from './index'
import mongoose from 'mongoose'

describe('MongodbService', () => {
  jest.spyOn(console, 'log').mockImplementation(() => {})

  it('it should handle connecting correctly', async () => {
    jest.spyOn(mongoose, 'connect')
      .mockResolvedValueOnce()
      .mockRejectedValueOnce('bang!')
    await MongodbService()
    await MongodbService()

    expect(mongoose.connect).toHaveBeenCalledWith(
      'mongodb://mongodb/jb-dev',
      {
        bufferMaxEntries: 0,
        keepAlive: 120,
        poolSize: 10,
        reconnectInterval: 500,
        reconnectTries: expect.any(Number)
      }
    )
    expect(console.log.mock.calls[0][0])
      .toEqual('Mongodb [mongodb://mongodb/jb-dev]: Connected!')
  })
})
