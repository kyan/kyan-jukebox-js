import ErrorHandler from '../handlers/errors'
import { JBUserInterface } from '../models/user'

export interface PayloadInterface {
  jwt?: string
  key: string
  data: any
  user?: JBUserInterface
}

const Payload = {
  decode: (payloadStr: string): PayloadInterface => {
    const { jwt, key, data } = JSON.parse(payloadStr)

    ErrorHandler.expectationThatThrows({
      expect: key, message: `[Payload.decode] No key provided! ${payloadStr}`
    })

    return { jwt, key, data }
  },

  encodeToJson: (payload: PayloadInterface): string => {
    ErrorHandler.expectationThatThrows({
      expect: payload.key, message: '[Payload.encodeToJson] No key provided!'
    })

    return JSON.stringify(payload)
  }
}

export default Payload
