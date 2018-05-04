const Payload = {
  encode: (jwt, key, data) => {
    return {
      jwt,
      key,
      data
    }
  },

  decode: payload => {
    return JSON.parse(payload)
  },

  encodeToJson: (jwt, key, data) => {
    return JSON.stringify(Payload.encode(jwt, key, data))
  }
}

export default Payload
