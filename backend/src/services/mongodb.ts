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

const MongodbService = () => (
  new Promise((resolve, reject): Promise<boolean|void> => {
    return connect(mongodbUrl, options).then(() => {
      logger.info(`Mongodb Connected`, { url: process.env.MONGODB_URL })
      resolve(true)
    }).catch(err => {
      logger.error(`Mongodb: ${err}`, { url: process.env.MONGODB_URL })
      reject(new Error('MongoDB failed to connect!'))
    })
  })
)

export default MongodbService
