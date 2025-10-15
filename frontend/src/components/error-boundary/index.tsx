import React, { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Display fallback UI
    this.setState({ hasError: true })

    // You can also log the error to an error reporting service
    if (process.env.NODE_ENV === 'development') {
      console.log(`error: ${error}`)
      console.log(`info: ${errorInfo}`)
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <h1>Ouch! I broke a bit.</h1>
    }
    return this.props.children
  }
}

export default ErrorBoundary
