import { LocalStorage } from 'node-localstorage'

const storage = new LocalStorage(process.env.LOCAL_STORAGE_PATH)

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
  addToUniqueArray: (key, value, limit) => {
    let ary = Settings.getItem(key) || []
    if (ary.constructor !== Array) {
      throw new Error(`addToUniqueArray: ${key} is currently NOT an Array`)
    }
    if (!ary.includes(value)) ary.push(value)
    if (limit) ary.splice(0, ary.length - Number(limit))

    const newData = [...new Set(ary)]
    storage.setItem(key, JSON.stringify(newData))
    return newData
  }
}

export default Settings
