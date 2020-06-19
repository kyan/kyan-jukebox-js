import ErrorHandler from '../handlers/errors'

export interface Payload {
  jwt?: string
  key: boolean
  data: object
  user?: object
}

const Payload = {
  toJsonString: (payload: Payload): string => JSON.stringify(payload),

  decode: (payloadStr: string): Payload => {
    const { jwt, key, data } = JSON.parse(payloadStr)

    ErrorHandler.expectationThatThrows({
      expect: key, message: `[Payload.decode] No key provided! ${payloadStr}`
    })

    return { jwt, key, data }
  },

  encodeToJson: (payload: Payload): string => {
    ErrorHandler.expectationThatThrows({
      expect: payload.key, message: '[Payload.encodeToJson] No key provided!'
    })

    return Payload.toJsonString(payload)
  }
}

export default Payload
