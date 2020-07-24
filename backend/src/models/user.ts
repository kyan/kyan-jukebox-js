import { Document, Schema, model } from 'mongoose'

export interface JBUserInterface {
  _id: any
  fullname: string
  picture: string
}

export interface DBUserInterface extends JBUserInterface, Document {}

const userSchema = new Schema(
  {
    _id: Schema.Types.String,
    fullname: Schema.Types.String,
    picture: Schema.Types.String
  },
  { _id: false }
)
const User = model<DBUserInterface>('User', userSchema)

export default User
