import mongoose from 'mongoose'

const trackSchema = mongoose.Schema({
  _id: String,
  added_by: mongoose.Schema.Types.Array
})

const Track = mongoose.model('Track', trackSchema)

export default Track
