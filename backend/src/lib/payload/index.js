const Payload = {
  encode: (key, data) => {
    return {
      key,
      data
    }
  },

  encodeKey: (service, key) => {
    return [service, key].join('::')
  },

  decode: payload => {
    const { key, data } = JSON.parse(payload)
    const [service, passedKey] = key.split('::')
    if (!passedKey) {
      throw new Error(`No service key provided! ${payload}`)
    }

    return { service, key: passedKey, data }
  },

  encodeToJson: (key, data) => {
    return JSON.stringify(Payload.encode(key, data))
  }
}

export default Payload
