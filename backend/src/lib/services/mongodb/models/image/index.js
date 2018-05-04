import mongoose from 'mongoose'

const imageSchema = mongoose.Schema({
  uri: String,
  data: mongoose.Schema.Types.Mixed,
  expireAt: Date
})
imageSchema.index(
  { expireAt: 1 },
  { expireAfterSeconds: 0 }
)
const Image = mongoose.model('Image', imageSchema)

export default Image
