const Payload = {
  encode: (key, data) => {
    return {
      key,
      data
    }
  },

  decode: payload => {
    return JSON.parse(payload)
  },

  encodeToJson: (key, data) => {
    return JSON.stringify(Payload.encode(key, data))
  }
}

export default Payload
