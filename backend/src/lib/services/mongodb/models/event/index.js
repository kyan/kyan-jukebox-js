import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  user: String,
  key: String,
  payload: mongoose.Schema.Types.Mixed
})
const Event = mongoose.model('Event', eventSchema)

export default Event
