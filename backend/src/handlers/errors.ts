import invariant from 'invariant'

export interface ErrorHandlerInterface {
  expect: boolean
  message: string
}

const ErrorHandler = {
  expectationThatThrows: (args: ErrorHandlerInterface) => {
    invariant(args.expect, args.message)
  }
}

export default ErrorHandler
