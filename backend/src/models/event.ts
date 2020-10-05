import { Schema, Document, model } from 'mongoose'
import User from './user'

interface Event extends Document {
  user: User
  key: string
  payload: any
}

const eventSchema = new Schema({
  user: Schema.Types.String,
  key: Schema.Types.String,
  payload: Schema.Types.Mixed
})
const Event = model<Event>('Event', eventSchema)

export default Event
