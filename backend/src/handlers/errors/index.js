import invariant from 'invariant'

const ErrorHandler = {
  expectationThatThrows: ({ expect, message }) => {
    invariant(expect, message)
  }
}

export default ErrorHandler
