import { Document, Schema, model } from 'mongoose'
import { JBUser } from '../types/database'

// Re-export shared types for backwards compatibility
export type { JBUser }

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
