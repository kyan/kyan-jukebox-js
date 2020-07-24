import invariant from 'invariant'

interface ErrorHandlerInterface {
  expect: any
  message: string
}

const ErrorHandler = {
  expectationThatThrows: (args: ErrorHandlerInterface) => {
    invariant(args.expect, args.message)
  }
}

export default ErrorHandler
