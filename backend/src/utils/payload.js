import ErrorHandler from '../handlers/errors'

const Payload = {
  toJsonString: (data) => JSON.stringify(data),

  decode: payload => {
    const { jwt, key, data } = JSON.parse(payload)

    ErrorHandler.expectationThatThrows({
      expect: key, message: `[Payload.decode] No key provided! ${payload}`
    })

    return { jwt, key, data }
  },

  encodeToJson: (key, data, user) => {
    ErrorHandler.expectationThatThrows({
      expect: key, message: '[Payload.encodeToJson] No key provided!'
    })

    return Payload.toJsonString({ key, data, user })
  }
}

export default Payload
