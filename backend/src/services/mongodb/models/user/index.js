import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  _id: String,
  fullname: String,
  picture: String
}, { _id: false })
const User = mongoose.model('User', userSchema)

export default User
