import { connect, ConnectOptions } from 'mongoose'
import logger from '../config/logger'

const mongodbUrl = process.env.MONGODB_URL
const options = {
  maxPoolSize: 10
} as ConnectOptions

const MongodbService = () =>
  new Promise((resolve, reject): Promise<boolean | void> => {
    return connect(mongodbUrl, options)
      .then(() => {
        logger.info(`Mongodb Connected`, { url: process.env.MONGODB_URL })
        resolve(true)
      })
      .catch((err) => {
        logger.error(`Mongodb: ${err}`, { url: process.env.MONGODB_URL })
        reject(new Error('MongoDB failed to connect!'))
      })
  })

export default MongodbService
