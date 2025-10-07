import { Schema, model } from 'mongoose'

const SettingSchema = new Schema({
  key: Schema.Types.String,
  value: Schema.Types.Mixed
})

const Setting = model('Setting', SettingSchema)

export default Setting
