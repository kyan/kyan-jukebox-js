import { connect } from 'mongoose'
import logger from '../config/logger'

const mongodbUrl = process.env.MONGODB_URL
const options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  poolSize: 10,
  bufferMaxEntries: 0,
  useUnifiedTopology: true,
  useCreateIndex: true
}

const MongodbService = () => {
  return new Promise(async (resolve, reject): Promise<boolean|void> => {
    try {
      await connect(mongodbUrl, options)
      logger.info(`Mongodb Connected`, { url: process.env.MONGODB_URL })
      return resolve(true)
    }
    catch (err) {
      logger.error(`Mongodb: ${err}`, { url: process.env.MONGODB_URL })
      return reject(new Error('MongoDB failed to connect!'))
    }
  })
}

export default MongodbService
