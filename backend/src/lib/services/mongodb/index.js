import mongoose from 'mongoose'
import logger from '../../../config/winston'

const mongodbUrl = process.env.MONGODB_URL
const options = {
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  poolSize: 10,
  bufferMaxEntries: 0,
  keepAlive: 120
}

const MongodbService = () => {
  mongoose.connect(mongodbUrl, options).then(() => {
    logger.info(`Mongodb Connected`, { url: process.env.MONGODB_URL })
  }).catch(err => {
    logger.error(`Mongodb: ${err}`, { url: process.env.MONGODB_URL })
  })

  return mongoose
}

export default MongodbService
