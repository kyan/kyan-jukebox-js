import { Schema, Document, model} from 'mongoose'
import { DBUserInterface } from './user'

export interface DBEventInterface extends Document {
  user: DBUserInterface
  key: string
  payload: any
}

const eventSchema = new Schema({
  user: Schema.Types.String,
  key: Schema.Types.String,
  payload: Schema.Types.Mixed
})
const Event = model<DBEventInterface>('Event', eventSchema)

export default Event
