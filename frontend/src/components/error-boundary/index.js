import React from 'react'

// uses code from https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html
class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch (error, info) {
    // Display fallback UI
    this.setState({ hasError: true })

    // You can also log the error to an error reporting service
    if (process.env.NODE_ENV === 'development') {
      console.log(`error: ${error}`)
      console.log(`info: ${info}`)
    }
  }

  render () {
    if (this.state.hasError) {
      return <h1>Ouch! I broke a bit.</h1>
    }
    return this.props.children
  }
}

export default ErrorBoundary
