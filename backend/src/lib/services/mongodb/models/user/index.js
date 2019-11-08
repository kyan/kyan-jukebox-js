import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
  _id: String,
  fullname: String
}, { _id: false })
const User = mongoose.model('User', userSchema)

export default User
