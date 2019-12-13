import mongoose from 'mongoose'

const trackSchema = mongoose.Schema({
  trackUri: String,
  users: mongoose.Schema.Types.Array,
  at: Date
})

const Track = mongoose.model('Track', trackSchema)

export default Track
