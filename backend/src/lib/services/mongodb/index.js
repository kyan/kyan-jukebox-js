import mongoose from 'mongoose'

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
    console.log(`Mongodb [${process.env.MONGODB_URL}]: Connected!`)
  }).catch(err => {
    console.log(`Mongodb [${process.env.MONGODB_URL}]: Error: ${err}`)
  })

  return mongoose
}

export default MongodbService
