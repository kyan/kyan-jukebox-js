import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  user: mongoose.Schema.Types.String,
  key: mongoose.Schema.Types.String,
  payload: mongoose.Schema.Types.Mixed
})
const Event = mongoose.model('Event', eventSchema)

export default Event
