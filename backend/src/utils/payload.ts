import ErrorHandler from '../handlers/errors'
import { JBUser } from '../models/user'

interface Payload {
  key: string
  data: any
  user?: JBUser
}

const Payload = {
  decode: (payloadStr: string): Payload => {
    const { user, key, data } = JSON.parse(payloadStr)

    ErrorHandler.expectationThatThrows({
      expect: key,
      message: `[Payload.decode] No key provided! ${payloadStr}`
    })

    return { user, key, data }
  },

  encodeToJson: (payload: Payload): string => {
    ErrorHandler.expectationThatThrows({
      expect: payload.key,
      message: '[Payload.encodeToJson] No key provided!'
    })

    return JSON.stringify(payload)
  }
}

export default Payload
