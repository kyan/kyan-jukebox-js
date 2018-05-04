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

  decodeKey: (key) => {
    return key.split('::')
  },

  decode: payload => {
    const { jwt, key, data } = JSON.parse(payload)
    const [service, passedKey] = key.split('::')
    if (!passedKey) {
      throw new Error(`No service key provided! ${payload}`)
    }

    return {
      jwt_token: jwt,
      encoded_key: key,
      key: passedKey,
      service,
      data
    }
  },

  encodeToJson: (key, data) => {
    return JSON.stringify(Payload.encode(key, data))
  }
}

export default Payload
