import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
  fullname: String,
  username: String
})
const User = mongoose.model('User', userSchema)

export default User
