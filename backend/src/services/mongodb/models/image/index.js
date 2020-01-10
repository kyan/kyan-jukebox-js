import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema({
  _id: String,
  url: String,
  expireAt: Date
})
imageSchema.index(
  { expireAt: 1 },
  { expireAfterSeconds: 0 }
)
const Image = mongoose.model('Image', imageSchema)

export default Image
