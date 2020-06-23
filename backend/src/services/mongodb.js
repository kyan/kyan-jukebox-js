import mongoose from 'mongoose'
import logger from '../config/logger'

const mongodbUrl = process.env.MONGODB_URL
const options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  poolSize: 10,
  keepAlive: 120,
  bufferMaxEntries: 0,
  useUnifiedTopology: true,
  useCreateIndex: true
}

const MongodbService = () => {
  return new Promise((resolve, reject) => {
    return mongoose.connect(mongodbUrl, options).then(() => {
      logger.info(`Mongodb Connected`, { url: process.env.MONGODB_URL })
      return resolve(true)
    }).catch(err => {
      logger.error(`Mongodb: ${err}`, { url: process.env.MONGODB_URL })
      return reject(new Error('MongoDB failed to connect!'))
    })
  })
}

export default MongodbService
