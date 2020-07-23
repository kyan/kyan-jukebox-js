import { Schema, model, Document } from 'mongoose'

export interface DBImageInterface extends Document {
  _id: any
  url: string
  expireAt: Date
}

const imageSchema = new Schema(
  {
    _id: Schema.Types.String,
    url: Schema.Types.String,
    expireAt: Schema.Types.Date
  },
  { _id: false }
)
imageSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 })
const Image = model<DBImageInterface>('Image', imageSchema)

export default Image
