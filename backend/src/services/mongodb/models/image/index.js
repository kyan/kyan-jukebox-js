import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.String,
  url: mongoose.Schema.Types.String,
  expireAt: mongoose.Schema.Types.Date
}, { _id: false })
imageSchema.index(
  { expireAt: 1 },
  { expireAfterSeconds: 0 }
)
const Image = mongoose.model('Image', imageSchema)

export default Image
