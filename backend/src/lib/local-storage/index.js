import { LocalStorage } from 'node-localstorage'
import SettingsConstants from '../constants/settings'

const storage = new LocalStorage(process.env.LOCAL_STORAGE_PATH)

const checkIsAnArray = (key, ary) => {
  if (ary.constructor !== Array) {
    throw new Error(`addToUniqueArray: ${key} is currently NOT an Array`)
  }
}
const setInStorage = (key, newAry) => {
  const newData = [...new Set(newAry)]
  storage.setItem(key, JSON.stringify(newData))
  return newData
}

const Settings = {
  getItem: (key) => {
    const value = storage.getItem(key)
    return value ? JSON.parse(value) : null
  },
  setItem: (key, value) => {
    if (value) storage.setItem(key, JSON.stringify(value))
  },
  removeItem: (key) => storage.removeItem(key),
  clearAll: () => storage.clear(),
  clearCurrent: () => {
    return (
      storage.removeItem(SettingsConstants.TRACK_CURRENT) && storage.removeItem(SettingsConstants.TRACKLIST_CURRENT)
    )
  },
  addToUniqueArray: (key, value, limit) => {
    let ary = Settings.getItem(key) || []
    checkIsAnArray(key, ary)
    if (!ary.includes(value)) ary.push(value)
    if (limit) ary.splice(0, ary.length - Number(limit))
    const newData = setInStorage(key, ary)
    return newData
  },
  removeFromArray: (key, value) => {
    let ary = Settings.getItem(key) || []
    checkIsAnArray(key, ary)
    const newAry = ary.filter(obj => obj !== value)
    const newData = setInStorage(key, newAry)
    return newData
  }
}

export default Settings
