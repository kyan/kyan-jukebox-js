import { Document, Schema, model } from 'mongoose'

export interface JBUser {
  _id: any
  fullname: string
  email: string
}

interface User extends JBUser, Document {
  _id: any
}

const userSchema = new Schema(
  {
    _id: Schema.Types.String,
    fullname: Schema.Types.String,
    email: Schema.Types.String
  },
  { _id: false }
)
const User = model<User>('User', userSchema)

export default User
