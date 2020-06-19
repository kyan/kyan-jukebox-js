import invariant from 'invariant'

export interface ErrorHandlerSettings {
  expect: boolean
  message: string
}

const ErrorHandler = {
  expectationThatThrows: (args: ErrorHandlerSettings) => {
    invariant(args.expect, args.message)
  }
}

export default ErrorHandler
