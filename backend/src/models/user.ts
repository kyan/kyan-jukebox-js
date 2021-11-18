import { Document, Schema, model } from 'mongoose'

export interface JBUser {
  _id: any
  fullname: string
  picture: string
}

interface User extends JBUser, Document {
  _id: any
}

const userSchema = new Schema(
  {
    _id: Schema.Types.String,
    fullname: Schema.Types.String,
    picture: Schema.Types.String
  },
  { _id: false }
)
const User = model<User>('User', userSchema)

export default User
