import mongoose from 'mongoose'
import logger from 'config/winston'
import EnvVars from 'utils/env-vars'

const mongodbUrl = EnvVars.get('MONGODB_URL')
const options = {
  useFindAndModify: false,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  poolSize: 10,
  bufferMaxEntries: 0,
  keepAlive: 120
}

const MongodbService = () => {
  mongoose.connect(mongodbUrl, options).then(() => {
    logger.info(`Mongodb Connected`, { url: mongodbUrl })
  }).catch(err => {
    logger.error(`Mongodb: ${err}`, { url: mongodbUrl })
  })

  return mongoose
}

export default MongodbService
